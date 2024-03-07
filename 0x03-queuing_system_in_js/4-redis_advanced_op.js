import redis from 'redis';

const client = redis.createClient();

client.on('error', (err) => console.log(`Redis client error: ${err}`));
client.on('connect', () => console.log('Redis client connected'));

const holbertonSchoolsData = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2
};

Object.entries(holbertonSchoolsData).forEach(([key, value]) => {
    client.hset('HolbertonSchools', key, value, redis.print);
});

client.hgetall('HolbertonSchools', (err, reply) => {
    if (err) {
        console.log(`Error retrieving hash: ${err}`);
    } else {
        console.log(reply);
    }
});
