import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'meta_grandes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('grupo_id').unsigned().nullable().references('id').inTable('groups').onDelete('CASCADE')
      table.string('tipo', 20).notNullable()
      table.string('titulo').notNullable()
      table.text('descricao').nullable()
      table.string('status', 20).notNullable().defaultTo('ativa')
      table.date('data_inicio').notNullable()
      table.date('data_prazo').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
