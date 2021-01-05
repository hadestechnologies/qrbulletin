'use strict'

const { Command } = require('@adonisjs/ace')

const expoNotifer = use('App/Helpers/ExpoNotifier')

class SendNotification extends Command {
  static get signature () {
    return 'send:notification { token: Token to send refresh notification } { url: Url of bulletin board } { channel: channel of bulletin board }'
  }

  static get description () {
    return 'Sends all queued notifications'
  }

  async handle (args, options) {

    this.info(args.token)
	this.info(args.url)
	this.info(args.channel)

	expoNotifer([args])
  }
}

module.exports = SendNotification
