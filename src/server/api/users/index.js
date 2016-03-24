import koaRouter from 'koa-router'
import {getUser, addNewUser, updateUser, deleteUser} from './user-controller'
import config from '../config'
import jwt from 'koa-jwt'
import bodyparser from 'koa-bodyparser'

let router = koaRouter()
let jwtOptions = {secret: config.tokenSecret}

router.get('/:username', getUser)
router.post('/', jwt(jwtOptions), bodyparser(), addNewUser)
router.put('/:id', jwt(jwtOptions), bodyparser(), updateUser)
router.patch('/:id', jwt(jwtOptions), bodyparser(), updateUser)
router.delete('/:id', jwt(jwtOptions), deleteUser)

// TODO Create New User
// TODO Update User
// TODO Update Password
// TODO Get Multiple users
export default router
