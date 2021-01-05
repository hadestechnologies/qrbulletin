'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardMembersSchema extends Schema {
  up () {
    this.create('board_members', (table) => {
      table.increments()
      table.timestamps()
      table.integer('board_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.enu('role', ['admin', 'standard']).default('standard')
    })
  }

  down () {
    this.drop('board_members')
  }
}

module.exports = BoardMembersSchema
