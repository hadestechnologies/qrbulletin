'use strict'

const Interface = use('App/Controllers/interfaces/base/Interface')

class Account extends Interface {

	requiresAtuh() {
		return false
	}

}

module.exports = Account