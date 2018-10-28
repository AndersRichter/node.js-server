const koa = require('koa');

const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const router = require('koa-router')();

const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird, capSQL: true });

const info = {
    host: 'localhost',
    port: 5432,
    database: 'bmstu_db',
    user: 'andrey',
    password: 'andrey96'
};
const database = pgp(info);
const app = new koa();


router.get('/api', async (ctx) => {
    const test = await database.any(
        `SELECT * FROM test`
    );

    if (test) {
        ctx.body = test;
        ctx.status = 200;
    } else {
        ctx.body = { message: "Can't find user" };
        ctx.status = 404;
    }
});

app
    .use(bodyparser())
    .use(logger())
    .use(router.routes());

app.listen(5000, () => {
    console.log('Server listen port -> 5000');
});