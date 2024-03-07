import redis from 'redis';

const client = redis.createClient();

client.on('error', (err) => console.log(`Redis client error: ${err}`));
client.on('connect', () => console.log('Redis client connected'));

function setNewSchool(schoolName, value) {
    client.set(schoolName, value, redis.print);
}

function displaySchoolValue(schoolName) {
    client.get(schoolName, redis.print);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
