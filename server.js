const koa = require('koa');
const moment = require('moment');
const uuidv1 = require('uuid/v1');

const serverToken = '7feb24af-fc38-44de-bc38-04defc3804de';

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

const times = [];

count = (array) => {
    if (array.length < 2) return 900000;
    let times = [];
    for (let i = 0; i < array.length - 1; i++) {
        times.push(array[i+1] - array[i]);
    }
    let average = 0;
    times.forEach(item => {
        average += item;
    });
    return Math.floor(average / times.length);
};

router.get('/api/form', async (ctx) => {
    const uuid = uuidv1();

    const data = await database.one(
        `INSERT INTO users (user_token) VALUES ('${uuid}') RETURNING id`
    );

    ctx.body = {
        user_id: data.id,
        user_token: uuid
    };
    ctx.status = 201;
});

router.post('/api/form', async (ctx) => {
    if (ctx.request.body.server_token &&
        ctx.request.body.server_token !== serverToken) {
        ctx.status = 401;
        return;
    }

    const token = await database.one(
      `SELECT user_token FROM users WHERE id = ${ctx.request.body.user_id}`
    );

    if (ctx.request.body.user_token &&
        ctx.request.body.user_token !== token.user_token) {
        ctx.status = 401;
        return;
    }

    const data = await database.any(
        `SELECT * FROM users WHERE id = ${ctx.request.body.user_id}`
    );

    ctx.body = {
        user_id: ctx.request.body.user_id,
        user_token: token.user_token,
        passport: {
            first_name: data.first_name,
            second_name: data.second_name,
            third_name: data.third_name,
            gender: data.gender,
            birthday: data.birthday,
            born_place: data.born_place,
            seria: data.seria,
            number: data.number,
            issued_by: data.issued_by,
            issued_date: data.issued_date,
            issued_code: data.issued_code,
            live_address: data.live_address,
            fact_address: data.fact_address,
        },
        parents: {
            mother: {
                first_name: data.m_first_name,
                second_name: data.m_second_name,
                third_name: data.m_third_name,
                birthday: data.m_birthday,
                born_place: data.m_born_place,
                address: data.m_address,
                fact_address: data.m_fact_address,
                work: data.m_work,
            },
            father: {
                first_name: data.f_first_name,
                second_name: data.f_second_name,
                third_name: data.f_third_name,
                birthday: data.f_birthday,
                born_place: data.f_born_place,
                address: data.f_address,
                fact_address: data.f_fact_address,
                work: data.f_work,
            }
        },
        certificate:  {
            number: data.c_number,
            issued_date: data.c_issued_date,
            school: data.c_school,
        }
    };
    ctx.status = 200;
});

router.put('/api/form', async (ctx) => {
    const token = await database.one(
        `SELECT user_token FROM users WHERE id = ${ctx.request.body.user_id}`
    );

    if (ctx.request.body.user_token &&
        ctx.request.body.user_token !== token.user_token) {
        ctx.status = 401;
        return;
    }

    const data = ctx.request.body;

    await database.none(
        `UPDATE users SET
            first_name = '${data.passport.first_name}',
            second_name = '${data.passport.second_name}',
            third_name = '${data.passport.third_name}',
            gender = '${data.passport.gender}',
            birthday = '${data.passport.birthday}',
            born_place = '${data.passport.born_place}',
            seria = '${data.passport.seria}',
            number = '${data.passport.number}',
            issued_by = '${data.passport.issued_by}',
            issued_date = '${data.passport.issued_date}',
            issued_code = '${data.passport.issued_code}',
            live_address = '${data.passport.live_address}',
            fact_address = '${data.passport.fact_address}',
            m_first_name = '${data.parents.mother.first_name}',
            m_second_name = '${data.parents.mother.second_name}',
            m_third_name = '${data.parents.mother.third_name}',
            m_birthday = '${data.parents.mother.birthday}',
            m_born_place = '${data.parents.mother.born_place}',
            m_address = '${data.parents.mother.address}',
            m_fact_address = '${data.parents.mother.fact_address}',
            m_work = '${data.parents.mother.work}',
            f_first_name = '${data.parents.father.first_name}',
            f_second_name = '${data.parents.father.second_name}',
            f_third_name = '${data.parents.father.third_name}',
            f_birthday = '${data.parents.father.birthday}',
            f_born_place = '${data.parents.father.born_place}',
            f_address = '${data.parents.father.address}',
            f_fact_address = '${data.parents.father.fact_address}',
            f_work = '${data.parents.father.work}',
            c_number = '${data.certificate.number}',
            c_issued_date = '${data.certificate.issued_date}',
            c_school = '${data.certificate.school}'
        WHERE id = ${data.user_id};`
    );

    ctx.status = 202;
});

router.put('/api/queue', async (ctx) => {
    if (ctx.request.body.server_token &&
        ctx.request.body.server_token !== serverToken) {
        ctx.status = 401;
        return;
    }

    await database.none(
        `INSERT INTO queue (user_numbers) VALUES (${ctx.request.body.number});`
    );

    ctx.status = 202;
});

router.delete('/api/queue', async (ctx) => {
    if (ctx.request.body.server_token &&
        ctx.request.body.server_token !== serverToken) {
        ctx.status = 401;
        return;
    }

    await database.none(
        `DELETE FROM queue WHERE user_numbers = (${ctx.request.body.number});`
    );

    times.push(Date.now());

    ctx.status = 202;
});

router.get('/api/queue', async (ctx) => {
    if (ctx.request.body.server_token &&
        ctx.request.body.server_token !== serverToken) {
        ctx.status = 401;
        return;
    }

    const data = await database.any(
        `SELECT * FROM queue;`
    );

    let response = [];
    data.forEach(item => {
       response.push(item.user_numbers);
    });


    ctx.body = {
      queue: response,
      average_time: count(times)
    };
    ctx.status = 202;
});

app
    .use(bodyparser())
    .use(logger())
    .use(router.routes());

app.listen(5000, () => {
    console.log('Server listen port -> 5000');
});