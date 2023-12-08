import http from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from "pg";
import * as redis from "redis";
import env from "./env";


async function main() {

    // postgres

    const pgClient = new Pool({
        host: env.pgHost,
        database: env.pgDatabase,
        user: env.pgUser,
        password: env.pgPassword,
        port: env.pgPort
    });

    pgClient.on('error', error => console.log(error));
    await pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)');

    console.log('Postgres client connected');

    // redis

    const redisClient = redis.createClient({ url: env.redisUrl });
    redisClient.on('error', err => console.log('Redis Client Error', err)).connect();

    const redisPublisher = redisClient.duplicate();
    redisPublisher.on('error', error => console.log(error)).connect();

    console.log('Redis clients connected');


    // app 

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());


    app.get('/', (_, res) => res.send('Hello from Fibonacci API'));


    app.get('/values/all', async function (_, res) {
        // fetch all indices from postgres
        const values = await pgClient.query('SELECT * FROM values');
        return res.send(values.rows);
    });


    app.get('/values/current', async function (_, res) {
        // fetch all indices and their values from redis
        const values = await redisClient.hGetAll('values');
        return res.send(values);
    });


    app.post('/values', async function (req, res) {
        // insert into redis and postgres
        const fibIndex = Number(req.body.index);

        if (fibIndex > 40) return res.status(422).send('Index too high');

        await redisClient.hSet('values', fibIndex, '');
        await redisPublisher.publish('insert', fibIndex.toString());
        await pgClient.query('INSERT INTO values(number) VALUES($1)', [fibIndex]);

        return res.status(200).send({ working: true });

    });

    // server 

    const server = http.createServer(app);
    server.listen(env.serverPort, () => console.log(`Server is running on port ${env.serverPort}`));

}

main();




