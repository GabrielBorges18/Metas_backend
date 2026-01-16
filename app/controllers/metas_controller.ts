import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import MetaGrande from '#models/meta_grande'
import MetaPequena from '#models/meta_pequena'
import Group from '#models/group'
import {
  createMetaGrandeValidator,
  updateMetaGrandeValidator,
  createMetaPequenaValidator,
  updateMetaPequenaValidator,
} from '#validators/meta'

export default class MetasController {
  async index({ auth, request, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const grupoId = request.input('grupoId')
    let query = MetaGrande.query().where('user_id', user.id).preload('metasPequenas')

    if (grupoId) {
      // Buscar metas dos membros do grupo
      const grupo = await Group.findOrFail(grupoId)
      await grupo.load('membros')
      const membrosIds = grupo.membros.map((m) => m.id)

      query = MetaGrande.query()
        .whereIn('user_id', membrosIds)
        .where('grupo_id', grupoId)
        .preload('metasPequenas')
        .preload('user', (query) => {
          query.select('id', 'nome', 'email')
        })
    }

    const metas = await query

    return response.ok(
      metas.map((meta) => ({
        id: meta.id.toString(),
        userId: meta.userId.toString(),
        tipo: meta.tipo,
        titulo: meta.titulo,
        descricao: meta.descricao,
        status: meta.status,
        dataInicio: meta.dataInicio.toISO(),
        dataPrazo: meta.dataPrazo?.toISO(),
        metasPequenas: meta.metasPequenas.map((mp: { id: number; titulo: string; status: string }) => ({
          id: mp.id.toString(),
          titulo: mp.titulo,
          status: mp.status as 'pendente' | 'concluída',
        })),
        ...(meta.user && {
          user: {
            id: meta.user.id.toString(),
            nome: meta.user.name,
            email: meta.user.email,
          },
        }),
      }))
    )
  }

  async store({ auth, request, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const data = await request.validateUsing(createMetaGrandeValidator)
    const { tipo, titulo, descricao, status, dataInicio, dataPrazo, grupoId, metasPequenas } = data

    const meta = await MetaGrande.create({
      userId: user.id,
      grupoId: grupoId || null,
      tipo,
      titulo,
      descricao: descricao || null,
      status: status || 'ativa',
      dataInicio: DateTime.fromJSDate(dataInicio),
      dataPrazo: dataPrazo ? DateTime.fromJSDate(dataPrazo) : null,
    })

    if (metasPequenas && metasPequenas.length > 0) {
      await MetaPequena.createMany(
        metasPequenas.map((mp: { titulo: string }) => ({
          metaGrandeId: meta.id,
          titulo: mp.titulo,
          status: 'pendente' as 'pendente' | 'concluída',
        }))
      )
    }

    await meta.load('metasPequenas')

    return response.created({
      id: meta.id.toString(),
      userId: meta.userId.toString(),
      tipo: meta.tipo,
      titulo: meta.titulo,
      descricao: meta.descricao,
      status: meta.status,
      dataInicio: meta.dataInicio.toISO(),
      dataPrazo: meta.dataPrazo?.toISO(),
      metasPequenas: meta.metasPequenas.map((mp: { id: number; titulo: string; status: string }) => ({
        id: mp.id.toString(),
        titulo: mp.titulo,
        status: mp.status as 'pendente' | 'concluída' | 'pausada',
      })),
    })
  }

  async show({ auth, params, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const meta = await MetaGrande.query()
      .where('id', params.id)
      .preload('metasPequenas')
      .preload('user', (query) => {
        query.select('id', 'nome', 'email')
      })
      .firstOrFail()

    // Verificar se o usuário pode ver esta meta
    if (meta.userId !== user.id && meta.grupoId) {
      const grupo = await Group.findOrFail(meta.grupoId)
      await grupo.load('membros')
      const isMember = grupo.membros.some((m) => m.id === user.id)
      if (!isMember) {
        return response.forbidden({ message: 'Acesso negado' })
      }
    } else if (meta.userId !== user.id) {
      return response.forbidden({ message: 'Acesso negado' })
    }

    return response.ok({
      id: meta.id.toString(),
      userId: meta.userId.toString(),
      tipo: meta.tipo,
      titulo: meta.titulo,
      descricao: meta.descricao,
      status: meta.status,
      dataInicio: meta.dataInicio.toISO(),
      dataPrazo: meta.dataPrazo?.toISO(),
      metasPequenas: meta.metasPequenas.map((mp) => ({
        id: mp.id.toString(),
        titulo: mp.titulo,
        status: mp.status,
      })),
      user: {
        id: meta.user.id.toString(),
        nome: meta.user.name,
        email: meta.user.email,
      },
    })
  }

  async update({ auth, params, request, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const meta = await MetaGrande.findOrFail(params.id)

    if (meta.userId !== user.id) {
      return response.forbidden({ message: 'Você não tem permissão para editar esta meta' })
    }

    const data = await request.validateUsing(updateMetaGrandeValidator)

    meta.merge({
      tipo: data.tipo,
      titulo: data.titulo,
      descricao: data.descricao !== undefined ? data.descricao : meta.descricao,
      status: data.status,
      dataInicio: data.dataInicio ? DateTime.fromJSDate(data.dataInicio) : meta.dataInicio,
      dataPrazo: data.dataPrazo !== undefined ? (data.dataPrazo ? DateTime.fromJSDate(data.dataPrazo) : null) : meta.dataPrazo,
    })

    await meta.save()

    // Atualizar ou criar metas pequenas
    if (data.metasPequenas) {
      const existingIds = data.metasPequenas
        .map((mp) => mp.id)
        .filter((id): id is number => id !== undefined && id !== null)

      // Remover metas pequenas que não estão mais na lista
      await MetaPequena.query().where('meta_grande_id', meta.id).whereNotIn('id', existingIds).delete()

      // Atualizar ou criar metas pequenas
      for (const mp of data.metasPequenas as { id: number; titulo: string; status: string }[]) {
        if (mp.id) {
          await MetaPequena.query()
            .where('id', mp.id)
            .where('meta_grande_id', meta.id)
            .update({
              titulo: mp.titulo,
              status: mp.status as 'pendente' | 'concluída',
            })
        } else {
          await MetaPequena.create({
            metaGrandeId: meta.id,
            titulo: mp.titulo,
            status: mp.status as 'pendente' | 'concluída',
          })
        }
      }
    }

    await meta.load('metasPequenas')

    return response.ok({
      id: meta.id.toString(),
      userId: meta.userId.toString(),
      tipo: meta.tipo,
      titulo: meta.titulo,
      descricao: meta.descricao,
      status: meta.status,
      dataInicio: meta.dataInicio.toISO(),
      dataPrazo: meta.dataPrazo?.toISO(),
      metasPequenas: meta.metasPequenas.map((mp) => ({
        id: mp.id.toString(),
        titulo: mp.titulo,
        status: mp.status,
      })),
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const meta = await MetaGrande.findOrFail(params.id)

    if (meta.userId !== user.id) {
      return response.forbidden({ message: 'Você não tem permissão para excluir esta meta' })
    }

    await meta.delete()

    return response.ok({ message: 'Meta excluída com sucesso' })
  }

  async addMetaPequena({ auth, params, request, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const meta = await MetaGrande.findOrFail(params.id)

    if (meta.userId !== user.id) {
      return response.forbidden({ message: 'Você não tem permissão para adicionar metas pequenas' })
    }

    const data = await request.validateUsing(createMetaPequenaValidator)

    const metaPequena = await MetaPequena.create({
      metaGrandeId: meta.id,
      titulo: data.titulo,
      status: 'pendente',
    })

    return response.created({
      id: metaPequena.id.toString(),
      titulo: metaPequena.titulo,
      status: metaPequena.status,
    })
  }

  async updateMetaPequena({ auth, params, request, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const metaPequena = await MetaPequena.query()
      .where('id', params.metaPequenaId)
      .preload('metaGrande')
      .firstOrFail()

    if (metaPequena.metaGrande.userId !== user.id) {
      return response.forbidden({ message: 'Você não tem permissão para editar esta meta pequena' })
    }

    const data = await request.validateUsing(updateMetaPequenaValidator)

    metaPequena.merge({
      titulo: data.titulo,
      status: data.status,
    })

    await metaPequena.save()

    return response.ok({
      id: metaPequena.id.toString(),
      titulo: metaPequena.titulo,
      status: metaPequena.status,
    })
  }

  async deleteMetaPequena({ auth, params, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const metaPequena = await MetaPequena.query()
      .where('id', params.metaPequenaId)
      .preload('metaGrande')
      .firstOrFail()

    if (metaPequena.metaGrande.userId !== user.id) {
      return response.forbidden({ message: 'Você não tem permissão para excluir esta meta pequena' })
    }

    await metaPequena.delete()

    return response.ok({ message: 'Meta pequena excluída com sucesso' })
  }
}
