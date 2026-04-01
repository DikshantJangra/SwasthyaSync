import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis };

let redisInstance: any = null;

// Only use Redis if a URL is provided and we are either in production 
// OR it's a non-localhost URL (which implies a real cloud Redis).
if (process.env.REDIS_URL && (!process.env.REDIS_URL.includes('localhost') && !process.env.REDIS_URL.includes('127.0.0.1'))) {
  try {
    redisInstance = globalForRedis.redis || new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
    
    redisInstance.on('error', (err: any) => {
      console.error('Redis connection error:', err.message);
    });
  } catch (e) {
    redisInstance = null;
  }
} else {
  // In development without a real cloud Redis, we stay completely silent.
  // No connection attempts will be made to localhost.
  redisInstance = null;
}

export const redis = redisInstance;

if (process.env.NODE_ENV !== 'production' && redisInstance) {
    globalForRedis.redis = redisInstance;
}
