import vine from '@vinejs/vine'

export const createGroupValidator = vine.compile(
  vine.object({
    nome: vine.string().minLength(1).maxLength(255),
    descricao: vine.string().optional(),
  })
)

export const joinGroupValidator = vine.compile(
  vine.object({
    codigoConvite: vine.string().minLength(1).maxLength(10),
  })
)
