'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Boards = use('App/Models/Boards')
const BoardMembers = use('App/Models/BoardMembers')

class BoardController {

	async isBoardAdmin(auth, board_id) {
		let board_member = await BoardMembers.where('board_id', board_id).where('user_id', auth.user.id).first()
		if (board_member) {
			return board_member.type == 'admin'
		}
		return false
	}

	async create ({ auth, request, params, response }) {
		const params = request.only(['board', 'type', 'password'])
		if (auth.user == null)
			params.type = 'public'

		try {
			let board = await Boards.findBy('name', params.board)
			if (board == null) {

				board = new Boards()
				board.name = params.board
				board.type = params.type
				board.options = params.type == 'password' && params.password != null ? {password: params.password} : ''

				await board.save()

				return response.send({result:'ok', id:board.id})
			}

		} catch (e) {
			console.log(e)
		}

		yield response.send({result:'failed'})
	}

	async addAdmin({ auth, request, params, response }) {
		const params = request.only(['board', 'username'])

		try {
			let board = await Boards.findByOrFail('name', params.board)

			if (board.type == 'userlist' && await isBoardAdmin(auth, board.id)) {

				let user = await User.findByOrFail('username', params.username)

				let board_member = await BoardMembers.where('board_id', board.id).where('user_id', user.id).first()
				if (!board_member) {
					
					board_member.type = 'admin'
					yield board_member.save()

				} else {
					board_member = new BoardMember()
					board_member.board_id = board.id
					board_member.user_id = user.id
					board_member.type = 'admin'

					yield board_member.save()

				}

				return yield response.send({result:'ok'})
			}

		} catch (e) {
			console.log(e)
		}

		return yield response.send({result:'failed'})
	}

	async removeAdmin({ auth, request, params, response }) {
		const params = request.only(['board', 'username'])

		try {
			let board = await Boards.findByOrFail('name', params.board)

			if (board.type == 'userlist' && await isBoardAdmin(auth, board.id)) {

				let user = await User.findByOrFail('username', params.username)

				let board_member = await BoardMembers.where('board_id', board.id).where('user_id', user.id).first()
				if (!board_member) {
					
					board_member.type = 'standard'
					yield board_member.save()

					return yield response.send({result:'ok'})
				}
			}

		} catch (e) {
			console.log(e)
		}

		return yield response.send({result:'failed'})
	}

	async addParticipant({ auth, request, params, response }) {
		const params = request.only(['board', 'username'])

		try {
			let board = await Boards.findByOrFail('name', params.board)

			if (board.type == 'userlist' && await isBoardAdmin(auth, board.id)) {

				let user = await User.findByOrFail('username', params.username)

				let board_member = await BoardMembers.where('board_id', board.id).where('user_id', user.id).first()
				if (!board_member) {
					
					board_member.type = 'standard'
					yield board_member.save()

				} else {
					board_member = new BoardMember()
					board_member.board_id = board.id
					board_member.user_id = user.id
					board_member.type = 'standard'

					yield board_member.save()

				}

				return yield response.send({result:'ok'})
			}

		} catch (e) {
			console.log(e)
		}

		return yield response.send({result:'failed'})
	}

	async removeParticipant({ auth, request, params, response }) {
		const params = request.only(['board', 'username'])

		try {
			let board = await Boards.findByOrFail('name', params.board)

			if (board.type == 'userlist' && await isBoardAdmin(auth, board.id)) {

				let user = await User.findByOrFail('username', params.username)

				let board_member = await BoardMembers.where('board_id', board.id).where('user_id', user.id).first()
				if (!board_member) {
					
					yield board_member.remove()
					return yield response.send({result:'ok'})

				}
			}

		} catch (e) {
			console.log(e)
		}

		return yield response.send({result:'failed'})
	}

}

module.exports = BoardController
