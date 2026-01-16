import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'meta_pequenas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('meta_grande_id').unsigned().notNullable().references('id').inTable('meta_grandes').onDelete('CASCADE')
      table.string('titulo').notNullable()
      table.string('status', 20).notNullable().defaultTo('pendente')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
