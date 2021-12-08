'use strict'

const { Command } = require('@adonisjs/ace')

const Broad = use('App/Models/Boards')
const Post = use('App/Models/Posts')

const sha256 = require('sha256')

class PostHtml extends Command {
  static get signature () {
    return 'post:uri {board: name of board to post broadcast} { id: Identity to send Html to } { uri: uri to follow }'
  }

  static get description () {
    return 'Post URI'
  }

  async handle (args, options) {
    let id = Buffer.from(args.id, 'hex')

    while (id.length < 16) {
        id = Buffer.concat([Buffer.alloc(1), id])
    }

    id = Buffer.from(sha256(sha256(id)), 'hex')

    let uri = Buffer.from(args.uri)

    let segment_descriptor = Buffer.alloc(5)
    segment_descriptor[0] = 3 // URI
    segment_descriptor.writeInt16LE(16, 1)
    segment_descriptor.writeInt16LE(uri.length, 3)

    let segement_descriptor_length = Buffer.alloc(1)
    segement_descriptor_length[0] = 5

    let message = Buffer.concat([segement_descriptor_length, segment_descriptor, id, uri])

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
