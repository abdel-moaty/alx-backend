import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on('error', (err) => console.log(`Redis client error: ${err}`));
client.on('connect', () => console.log('Redis client connected'));

const setNewSchool = async (schoolName, value) => {
    await setAsync(schoolName, value);
    console.log(`Set value ${value} for key ${schoolName}`);
};

const displaySchoolValue = async (schoolName) => {
    const value = await getAsync(schoolName);
    console.log(value);
};

const main = async () => {
    await displaySchoolValue('Holberton');
    await setNewSchool('HolbertonSanFrancisco', '100');
    await displaySchoolValue('HolbertonSanFrancisco');
};

main();
