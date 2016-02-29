import koaRouter from 'koa-router'
import authenticate from './authenticate'
import bodyparser from 'koa-bodyparser'

let router = koaRouter()

router.post('/', bodyparser(), authenticate)

export default router
