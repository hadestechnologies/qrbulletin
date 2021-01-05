'use strict'

const Database = use('Database')

const NotificationToken = use('App/Models/NotificationToken')

class NotificationsController {

	async update ({ request, response }) {
		const params = request.only(['identities', 'token', 'lang'])
		if (params) {
			console.log(params)

			try {
				for (let i=0; i<params.identities.length; i++) {
	    			let notification_entry = await NotificationToken.findBy('identity', params.identities[i])
	    			if (notification_entry) {
	    				notification_entry.token = params.token
	    				notification_entry.lang = params.lang

	    				await notification_entry.save()
	    			} else {
		    			notification_entry = new NotificationToken()
		    			notification_entry.identity = params.identities[i]
		    			notification_entry.token = params.token
		    			notification_entry.lang = params.lang

		    			await notification_entry.save()
		    		}
	    		}

    			return response.send({result:'ok'})
    		} catch (e) {
    			console.log(e)
    			return response.send(e)
    		}
		}
		response.send({result:'error'})
	}

}

module.exports = NotificationsController