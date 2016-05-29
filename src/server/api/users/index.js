import koaRouter from 'koa-router'
import config from '../config'
import jwt from 'koa-jwt'
import bodyparser from 'koa-bodyparser'
import {
  getUser,
  getUserList,
  addNewUser,
  updateUser,
  deleteUser,
  updatePassword
} from './user-controller'

let router = koaRouter()
let jwtOptions = {secret: config.tokenSecret}

router.get('/:username', getUser)
router.get('/', getUserList)
router.post('/', jwt(jwtOptions), bodyparser(), addNewUser)
router.put('/:id/password', jwt(jwtOptions), bodyparser(), updatePassword)
router.put('/:id', jwt(jwtOptions), bodyparser(), updateUser)
router.patch('/:id', jwt(jwtOptions), bodyparser(), updateUser)
router.delete('/:id', jwt(jwtOptions), deleteUser)

export default router
