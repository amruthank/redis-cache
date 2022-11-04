
import Redis from "ioredis";

//Setting up ioredis client
const redis = new Redis(process.env.REDIS_URL);
//const redis = new Redis("rediss://:********@apn1-fast-ape-34096.upstash.io:34096");

export default { redis };