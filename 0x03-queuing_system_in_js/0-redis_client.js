import redis from 'redis';

const client = redis.createClient();

client.on('error', (err) => console.log(`Redis client error: ${err}`));
client.on('connect', () => console.log('Redis client connected'));
