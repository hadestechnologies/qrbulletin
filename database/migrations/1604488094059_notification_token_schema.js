'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationTokenSchema extends Schema {
  up () {
    this.create('notification_tokens', (table) => {
      table.increments()
      table.timestamps()
      table.string('identity', 64).notNullable().unique()
      table.string('token', 64).notNullable()
      table.string('lang', 2).notNullable()
    })
  }

  down () {
    this.drop('notification_tokens')
  }
}

module.exports = NotificationTokenSchema
