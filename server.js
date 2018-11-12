const koa = require('koa');
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

countAverageTime = (array) => {
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

checkToken = async (ctx) => {
    if (ctx.request.body.server_token) {
        return checkServerToken(ctx);
    } else if (ctx.request.body.user_token) {
        const token = await database.one(
            `SELECT user_token FROM users WHERE id = ${ctx.request.body.user_id}`
        );
        return checkUserToken(ctx, token);
    } else {
        ctx.status = 403;
        return false;
    }
};

checkServerToken = (ctx) => {
    const token = ctx.request.body.server_token;
    if (token !== serverToken) {
        ctx.status = 403;
        return false;
    }
    return true;
};

checkUserToken = (ctx, user_token) => {
    const token = ctx.request.body.user_token;
    if (token !== user_token.user_token) {
        ctx.status = 403;
        return false;
    }
    return true;
};

// API FORM

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
    if (!await checkToken(ctx)) { return; }

    const data = await database.any(
        `SELECT * FROM users WHERE id = ${ctx.request.body.user_id}`
    );

    ctx.body = {
        user_id: ctx.request.body.user_id,
        user_token: data.user_token,
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
    if (!await checkToken(ctx)) { return; }

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

router.post('/api/form/clear', async (ctx) => {
    if (!await checkToken(ctx)) { return; }

    await database.none(
      `TRUNCATE TABLE users restart identity;`
    );

    ctx.status = 202;
});

// API QUEUE

router.post('/api/queue', async (ctx) => {
    if (!await checkToken(ctx)) { return; }

    ctx.status = 202;

    const data = await database.any(
        `SELECT * FROM queue;`
    );

    data.forEach(item => {
        if (item.user_numbers === ctx.request.body.number) {
            ctx.status = 400;
        }
    });

    if (ctx.status === 400) { return; }

    await database.none(
        `INSERT INTO queue (user_numbers) VALUES (${ctx.request.body.number});`
    );

    ctx.body = { message: 'OK'};
});

router.put('/api/queue', async (ctx) => {
    if (!await checkToken(ctx)) { return; }

    const data = await database.any(
        `SELECT * FROM queue;`
    );

    for (let i = 0; i < data.length; i++) {
        if (data[i].user_numbers === ctx.request.body.number) {
            ctx.body = { message: 'OK'};
            ctx.status = 202;
        }
    }

    if (ctx.status !== 202) { ctx.status = 404; return; }

    await database.none(
        `DELETE FROM queue WHERE user_numbers = (${ctx.request.body.number});`
    );

    await database.none(
        `INSERT INTO operate (user_numbers) VALUES (${ctx.request.body.number});`
    );

    times.push(Date.now());
});

router.delete('/api/queue', async (ctx) => {
    if (!await checkToken(ctx)) { return; }

    const data = await database.any(
        `SELECT * FROM operate;`
    );

    for (let i = 0; i < data.length; i++) {
        if (data[i].user_numbers === ctx.request.body.number) {
            ctx.body = { message: 'OK'};
            ctx.status = 202;
        }
    }

    if (ctx.status !== 202) { ctx.status = 404; return; }

    await database.none(
        `DELETE FROM operate WHERE user_numbers = (${ctx.request.body.number});`
    );
});

router.get('/api/queue', async (ctx) => {
    let queue = [];
    let operate = [];

    const data1 = await database.any(
        `SELECT * FROM queue;`
    );

    data1.forEach(item => {
        queue.unshift(item.user_numbers);
    });

    const data2 = await database.any(
        `SELECT * FROM operate;`
    );

    data2.forEach(item => {
        operate.unshift(item.user_numbers);
    });

    ctx.body = {
      queue: queue,
        operate: operate,
      average_time: countAverageTime(times)
    };
    ctx.status = 202;
});

router.post('/api/queue/clear', async (ctx) => {
    if (!await checkToken(ctx)) { return; }

    await database.none(
        `TRUNCATE TABLE queue restart identity;`
    );

    await database.none(
        `TRUNCATE TABLE operate restart identity;`
    );

    ctx.body = { message: 'OK'};
    ctx.status = 202;
});

app
    .use(bodyparser())
    .use(logger())
    .use(router.routes());

app.listen(5000, () => {
    console.log('Server listen port -> 5000');
});