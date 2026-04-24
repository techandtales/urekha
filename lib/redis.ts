import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;

// Global redis instance to reuse connection across requests in Next.js dev/prod
const globalForRedis = global as unknown as { redis: Redis };

const isBuild = process.env.VERCEL === '1' && process.env.CI === '1';

export const redis = globalForRedis.redis || new Redis(redisPort, redisHost, {
    maxRetriesPerRequest: 3,
    lazyConnect: isBuild, // Prevent connecting during Vercel build which causes ECONNREFUSED
});

redis.on("error", (error) => {
    console.error("[Redis] Connection error:", error.message);
});

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export default redis;
