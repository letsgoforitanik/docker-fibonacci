const env = {
    serverPort: process.env.SERVER_PORT,
    pgHost: process.env.PG_HOST,
    pgDatabase: process.env.PG_DATABASE,
    pgUser: process.env.PG_USER,
    pgPassword: process.env.PG_PASSWORD,
    pgPort: Number(process.env.PG_PORT),
    redisUrl: process.env.REDIS_URL
};

export default env;