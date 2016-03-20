import koaRouter from 'koa-router'
import {getUser, addNewUser} from './user-controller'
import config from '../config'
import jwt from 'koa-jwt'

let router = koaRouter()

router.get('/:username', getUser)
router.post('/', jwt({secret: config.tokenSecret}), addNewUser)

// TODO Create New User
// TODO Update User
// TODO Update Password
// TODO Get Multiple users
export default router
