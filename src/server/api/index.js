import koa from 'koa';
import logger from 'koa-logger';
import connectDB from './connectDB';
import router from './router';

// Connect to MongoDB
connectDB();

let app = koa();

// Set up routes for the API
app.use(router.routes());

export default app;
