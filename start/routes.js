'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/dispatch', 'DispatchController.process')

Route.post('/register', 'AccountController.register')
Route.post('/login', 'AccountController.login')
Route.post('/set_public_key', 'AccountController.setPublicKey')

Route.post('/board/create', 'BoardController.create')
Route.post('/board/admin/add', 'BoardController.addAdmin')
Route.post('/board/admin/remove', 'BoardController.removeAdmin')
Route.post('/board/participant/add', 'BoardController.addParticipant')
Route.post('/board/participant/remove', 'BoardController.removeParticipant')

Route.get('/:board?/:last_id?', 'PostController.index')
Route.post('/post', 'PostController.post')
Route.post('/notifications/update', 'NotificationsController.update')
