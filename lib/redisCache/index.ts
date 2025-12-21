import ioredis from "ioredis";
import "dotenv/config";

export const redisClient = new ioredis(process.env.REDIS_URL!);
