'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostsSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.timestamps()
      table.integer('board_id').unsigned().notNullable()
      table.string('post', 512).notNullable()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostsSchema
