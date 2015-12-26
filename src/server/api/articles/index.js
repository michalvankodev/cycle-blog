import koaRouter from 'koa-router';
import {getArticles, getSingleArticle} from './articles-controller';

let router = koaRouter();

router.get('/', getArticles);
router.get('/:id', getSingleArticle);

export default router;
