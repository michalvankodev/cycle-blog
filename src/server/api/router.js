import koaRouter from 'koa-router';
import users from './users';
import articles from './articles';

let router = koaRouter();

router.use('/users', users.routes());
router.use('/articles', articles.routes());

export default router;
