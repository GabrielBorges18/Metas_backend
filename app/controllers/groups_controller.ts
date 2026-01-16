import type { HttpContext } from '@adonisjs/core/http'
import Group from '#models/group'
import GroupMember from '#models/group_member'
import { createGroupValidator, joinGroupValidator } from '#validators/group'

function generateCodigoConvite(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default class GroupsController {
  async index({ auth, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const grupos = await Group.query()
      .whereHas('membros', (query) => {
        query.where('users.id', user.id)
      })
      .preload('membros', (query) => {
        query.select('id', 'nome', 'email')
      })

    return response.ok(
      grupos.map((grupo) => ({
        id: grupo.id.toString(),
        nome: grupo.nome,
        descricao: grupo.descricao,
        codigoConvite: grupo.codigoConvite,
        criadorId: grupo.criadorId.toString(),
        membrosIds: grupo.membros.map((m) => m.id.toString()),
        createdAt: grupo.createdAt.toISO(),
      }))
    )
  }

  async store({ auth, request, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const data = await request.validateUsing(createGroupValidator)
    const { nome, descricao } = data

    let codigoConvite: string
    let exists = true
    while (exists) {
      codigoConvite = generateCodigoConvite()
      const existing = await Group.findBy('codigoConvite', codigoConvite)
      exists = !!existing
    }

    const grupo = await Group.create({
      nome,
      descricao: descricao || 'Sem descrição',
      codigoConvite: codigoConvite!,
      criadorId: user.id,
    })

    // Criar o registro de membro usando o modelo GroupMember
    await GroupMember.create({
      groupId: grupo.id,
      userId: user.id,
    })

    await grupo.load('membros', (query) => {
      query.select('id', 'nome', 'email')
    })

    return response.created({
      id: grupo.id.toString(),
      nome: grupo.nome,
      descricao: grupo.descricao,
      codigoConvite: grupo.codigoConvite,
      criadorId: grupo.criadorId.toString(),
      membrosIds: grupo.membros.map((m) => m.id.toString()),
      createdAt: grupo.createdAt.toISO(),
    })
  }

  async join({ auth, request, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const { codigoConvite } = await request.validateUsing(joinGroupValidator)

    const grupo = await Group.findBy('codigoConvite', codigoConvite.toUpperCase())
    if (!grupo) {
      return response.notFound({ message: 'Código de convite inválido' })
    }

    await grupo.load('membros')
    const isMember = grupo.membros.some((m) => m.id === user.id)

    if (isMember) {
      return response.conflict({ message: 'Você já é membro deste grupo' })
    }

    // Criar o registro de membro usando o modelo GroupMember
    await GroupMember.create({
      groupId: grupo.id,
      userId: user.id,
    })

    await grupo.load('membros', (query) => {
      query.select('id', 'nome', 'email')
    })

    return response.ok({
      id: grupo.id.toString(),
      nome: grupo.nome,
      descricao: grupo.descricao,
      codigoConvite: grupo.codigoConvite,
      criadorId: grupo.criadorId.toString(),
      membrosIds: grupo.membros.map((m) => m.id.toString()),
      createdAt: grupo.createdAt.toISO(),
    })
  }

  async show({ auth, params, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const grupo = await Group.query()
      .where('id', params.id)
      .whereHas('membros', (query) => {
        query.where('users.id', user.id)
      })
      .preload('membros', (query) => {
        query.select('id', 'nome', 'email')
      })
      .firstOrFail()

    return response.ok({
      id: grupo.id.toString(),
      nome: grupo.nome,
      descricao: grupo.descricao,
      codigoConvite: grupo.codigoConvite,
      criadorId: grupo.criadorId.toString(),
      membrosIds: grupo.membros.map((m) => m.id.toString()),
      createdAt: grupo.createdAt.toISO(),
    })
  }
}
