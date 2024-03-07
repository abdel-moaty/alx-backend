import redis from 'redis';

const client = redis.createClient();

client.on('error', (err) => console.log(`Redis client not connected to the server: ${err}`));
client.on('connect', () => console.log('Redis client connected to the server'));

const publishMessage = (message, time) => {
    setTimeout(() => {
        console.log(`About to send ${message}`);
        client.publish('holberton school channel', message);
    }, time);
};

[100, 200, 300, 400].forEach((time, index) => publishMessage(`Holberton Student #${index + 1} starts course`, time));
publishMessage("KILL_SERVER", 500);
