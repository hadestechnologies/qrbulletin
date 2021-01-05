'use strict'

const Database = use('Database')

const Boards = use('App/Models/Boards')
const Posts = use('App/Models/Posts')

const NotificationToken = use('App/Models/NotificationToken')
const expoNotifer = use('App/Helpers/ExpoNotifier')

class PostController {

	async index ({ request, params, response }) {
    	let board =  params.board
    	let last_id = params.last_id ? params.last_id : 0

    	if (board) {
    		try {
    			let pending_rows = 0

    			const _b = await Boards.findByOrFail('name', board)
    			const count = await Database.from('posts').where('board_id', '=', _b.id).where('id', '>', last_id).count('* as count')

    			pending_rows = count[0].count

    			const posts = await Posts.query().where('board_id', '=', _b.id).where('id', '>', last_id).orderBy('id', 'asc').limit(100).fetch()

    			let ret = []
    			for (let i=0; i<posts.rows.length; i++) {
    				let row = {
    					id: posts.rows[i].id,
    					time: posts.rows[i].created_at,
    					post: posts.rows[i].post
    				}
    				ret.push(row)
    			}

    			const last_row = await Posts.query().where('board_id', '=', _b.id).orderBy('id', 'DESC').limit(1).fetch()
    			console.log(last_row.rows)

    			if (last_row.rows.length) {
	    			return response.send({
	    				latest_id: await last_row.rows[0].id,
	    				pending_messages: pending_rows,
	    				posts: ret
	    			})
	    		}
    		} catch (e) {
    			console.log(e)
    			return response.send(e)
    		}
    	} 
    	return response.send({
	    				latest_id: 0,
	    				pending_messages: 0,
	    				posts: []
	    			})
	}

	async post ({ request, response }) {
		const params = request.only(['board', 'post'])
		if (params) {
			try {
    			let board = await Boards.findByOrFail('name', params.board)
    			let post = new Posts()
    			post.board_id = board.id
    			post.post = params.post

    			await post.save()

    			let identity = Buffer.from(params.post, 'base64').slice(1,17).toString('hex')
    			console.log('Identidy -> '+identity)
    			let notification_entry = await NotificationToken.findBy('identity', identity)
    			console.log(notification_entry)

    			if (notification_entry) {
    				expoNotifer([{
    					token: notification_entry.token,
    					url: 'https://qrbullet.in',
    					channel: params.board
    				}])
    			}

    			return response.send({result:'ok', message_id:post.id})
    		} catch (e) {
    			console.log(e)
    			return response.send(e)
    		}
		}
		response.send({result:'error'})
	}

}

module.exports = PostController
