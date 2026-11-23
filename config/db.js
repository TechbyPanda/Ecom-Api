import pg from 'pg';
import { createClient } from 'redis';

export const postgres = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 3000,
    query_timeout: 3000,
});
postgres.on('error', (error) => console.error('PostgreSQL connection error', error.message));

export const redis = createClient({
    url: process.env.REDIS_URL,
    disableOfflineQueue: true,
});
redis.on('error', (error) => console.error('Redis connection error', error.message));
