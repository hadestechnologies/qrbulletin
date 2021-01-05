'use strict'

const Database = use('Database')

const Boards = use('App/Models/Boards')
const Posts = use('App/Models/Posts')

const NotificationToken = use('App/Models/NotificationToken')
const expoNotifer = use('App/Helpers/ExpoNotifier')

const md5 = require('md5')
const sha256 = require('sha256')
const Hash = use('Hash')

const elliptic = use('App/Helpers/Elliptic') 

class AccountController {

	async register ({ request, params, response }) {
    	const user = new User()
        user.username = request.input('username')
        user.password = yield Hash.make(request.input('password'))
        user.public_key = request.input('public_key')
        user.finger_print = md5(request.input('public_key'))

        yield user.save()

        yield response.send({result:'ok'})
	}

    async login ({ request, params, response }) {
        const user = await User.find(request.input('username', null))
        

        if (user) {
            const passhash = await Hash.make(request.input('password'))
            if (user.password == passhash) {
                const jwt = await auth.generate(user)
                yield response.send({result:'ok', jwt_token:jwt})
                return
            }
        } else {
            const user = await User.find(request.input('finger_print', null))
            const password = request.input('password')

            if (password) {
                const passhash = await Hash.make(password)

                if (user && user.password == passhash) {
                    const jwt = await auth.generate(user)
                    yield response.send({result:'ok', jwt_token:jwt})
                    return
                }
            } else {
                const sig = request.input('signiture')

                if (sig) {
                    let hash = Buffer.from(sha256(request.input('finger_print')), 'hex')
                    if (elliptic.verify(user.public_key, hash, sig)) {
                        const jwt = await auth.generate(user)
                        yield response.send({result:'ok', jwt_token:jwt})
                        return
                    }
                }
            }
        }
        yield response.send({result:'failed'})
    }

	async setPublicKey ({ request, params, response }) {
        let user = await auth.getUser()

        if (user) {
            const public_key = await request.input('public_key')

            user.public_key = public_key
            user.finger_print = md5(public_key)

            yield user.save()
            yield response.send({result:'ok'})
        }

        yield response.status(401).send('Permission denied, unauthenticated')
    }

}

module.exports = AccountController
