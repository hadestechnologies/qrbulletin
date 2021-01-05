'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardsSchema extends Schema {
  up () {
    this.table('boards', (table) => {
      // alter table
      table.enu('type', ['public', 'password', 'userlist']).default('public')
      table.text('metadata')
    })
  }

  down () {
    this.table('boards', (table) => {
      // reverse alternations
    })
  }
}

module.exports = BoardsSchema
