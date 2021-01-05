'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardsSchema extends Schema {
  up () {
    this.create('boards', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 32).notNullable().unique()
    })
  }

  down () {
    this.drop('boards')
  }
}

module.exports = BoardsSchema
