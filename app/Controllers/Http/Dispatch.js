'use strict'

class DispatchController {

	async process ({ auth, request, params, response }) {
		const input = request.only(['module', 'method', 'params'])

		console.log(input)
	}

}