import vine from '@vinejs/vine'

const tipoMeta = vine.enum(['Profissional', 'Pessoal', 'Estudos', 'Saúde', 'Outro'])
const statusMetaGrande = vine.enum(['ativa', 'concluída', 'pausada'])
const statusMetaPequena = vine.enum(['pendente', 'concluída'])

export const createMetaGrandeValidator = vine.compile(
  vine.object({
    tipo: tipoMeta,
    titulo: vine.string().minLength(1).maxLength(500),
    descricao: vine.string().maxLength(2000).optional(),
    status: statusMetaGrande.optional(),
    dataInicio: vine.date(),
    dataPrazo: vine.date().optional(),
    grupoId: vine.number().positive().optional(),
    metasPequenas: vine
      .array(
        vine.object({
          titulo: vine.string().minLength(1).maxLength(500),
        })
      )
      .optional(),
  })
)

export const updateMetaGrandeValidator = vine.compile(
  vine.object({
    tipo: tipoMeta.optional(),
    titulo: vine.string().minLength(1).maxLength(500).optional(),
    descricao: vine.string().maxLength(2000).optional(),
    status: statusMetaGrande.optional(),
    dataInicio: vine.date().optional(),
    dataPrazo: vine.date().optional(),
    metasPequenas: vine
      .array(
        vine.object({
          id: vine.number().positive().optional(),
          titulo: vine.string().minLength(1).maxLength(500),
          status: statusMetaPequena,
        })
      )
      .optional(),
  })
)

export const updateMetaPequenaValidator = vine.compile(
  vine.object({
    titulo: vine.string().minLength(1).maxLength(500).optional(),
    status: statusMetaPequena.optional(),
  })
)

export const createMetaPequenaValidator = vine.compile(
  vine.object({
    titulo: vine.string().minLength(1).maxLength(500),
  })
)
