import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import MetaGrande from './meta_grande.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class MetaPequena extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare metaGrandeId: number

  @column()
  declare titulo: string

  @column()
  declare status: 'pendente' | 'concluída'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => MetaGrande)
  declare metaGrande: BelongsTo<typeof MetaGrande>
}
