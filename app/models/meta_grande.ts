import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import MetaPequena from './meta_pequena.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class MetaGrande extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: string

  @column()
  declare grupoId: number | null

  @column()
  declare tipo: 'Profissional' | 'Pessoal' | 'Estudos' | 'Saúde' | 'Outro'

  @column()
  declare titulo: string

  @column()
  declare descricao: string | null

  @column()
  declare status: 'ativa' | 'concluída' | 'pausada'

  @column.date()
  declare dataInicio: DateTime

  @column.date()
  declare dataPrazo: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => MetaPequena)
  declare metasPequenas: HasMany<typeof MetaPequena>
}
