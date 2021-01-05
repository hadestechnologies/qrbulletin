'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.timestamps()
      table.string('username', 80).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('public_key', 64).notNullable()
      table.string('finger_print', 16).notNullable()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
