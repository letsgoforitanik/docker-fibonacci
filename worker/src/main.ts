import * as redis from "redis";
import env from "./env";
import fibonacci from "./fibonacci";



async function main() {
    const client = redis.createClient({ url: env.redisUrl });
    await client.on('error', err => console.log('Redis Client Error', err)).connect();

    const subscriber = client.duplicate();
    await subscriber.on('error', err => console.error(err)).connect();

    console.log('Redis clients are connected');

    subscriber.subscribe('insert', function (message, channel) {
        console.log(`Received message : ${message}`);
        const fibIndex = parseInt(message);
        const fibNumber = fibonacci(fibIndex);
        client.hSet('values', fibIndex, fibNumber);
    });

}

main();

