'use strict'

const { Command } = require('@adonisjs/ace')

const Broad = use('App/Models/Board')
const Post = use('App/Models/Post')

class PostHtml extends Command {
  static get signature () {
    return 'post:html {board: name of board to post broadcast} { id: Identity to send Html to } { html: Html to post }'
  }

  static get description () {
    return 'Post html'
  }

  async handle (args, options) {
    let id = Buffer.from(args.id, 'hex')

    while (id.length < 16) {
        id = Buffer.concat([Buffer.alloc(1), id])
    }

    let html = Buffer.from(args.html)

    let segment_descriptor = Buffer.alloc(5)
    segment_descriptor[0] = 2 // HTML
    segment_descriptor.writeInt16LE(16)
    segment_descriptor.writeInt16LE(html.length)

    let segement_descriptor_length = Buffer.alloc(1)
    segement_descriptor_length[0] = 5

    let message = Buffer.concat([segement_descriptor_length, segment_descriptor, html])

    let board = await Broad.findBy('name', args.board)
    if (board) {
        let post = new Post()
        post.board_id = board.id
        post.post = message.toString('base64')
        await post.save()

        console.log('Post Successful')
    } else {
        console.log('Post Failed')
    }

  }
}

module.exports = PostHtml
