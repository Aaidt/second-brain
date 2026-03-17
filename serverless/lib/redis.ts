import Redis from 'ioredis';

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    throw new Error("REDIS_URL is not defined");
}

export const redis = new Redis(process.env.REDIS_URL as string)
redis.on('error', (err) => console.error('Redis Error:', err));
redis.on('ready', () => console.log('Connected to Redis'));   