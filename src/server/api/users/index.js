import koaRouter from 'koa-router';
import {getUser} from './user-controller';

let router = koaRouter();

router.get('/:id', getUser);

export default router;
