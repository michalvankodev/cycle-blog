import koaRouter from 'koa-router'
import {getUser, addNewUser, updateUser} from './user-controller'
import config from '../config'
import jwt from 'koa-jwt'
import bodyparser from 'koa-bodyparser'

let router = koaRouter()

router.get('/:username', getUser)
router.post('/', jwt({secret: config.tokenSecret}), bodyparser(), addNewUser)
router.put('/:id', jwt({secret: config.tokenSecret}), bodyparser(), updateUser)
router.patch('/:id', jwt({secret: config.tokenSecret}), bodyparser(), updateUser)

// TODO Create New User
// TODO Update User
// TODO Update Password
// TODO Get Multiple users
export default router
