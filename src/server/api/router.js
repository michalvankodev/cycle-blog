import koaRouter from 'koa-router'
import users from './users'
import articles from './articles'
import auth from './auth'

let router = koaRouter()

router.use('/users', users.routes())
router.use('/authenticate', auth.routes())
router.use('/articles', articles.routes())

export default router
