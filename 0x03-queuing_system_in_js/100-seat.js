import express from 'express';
import kue from 'kue';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const client = redis.createClient();
const queue = kue.createQueue();

const reserveSeat = async (number) => {
    await client.set('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
    const getAsync = promisify(client.get).bind(client);
    return await getAsync('available_seats');
};

let reservationEnabled = true;

app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats });
});

app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        return res.json({ "status": "Reservation are blocked" });
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (err) {
            return res.json({ "status": "Reservation failed" });
        }
        res.json({ "status": "Reservation in process" });
    });

    job.on('complete', (result) => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err}`);
    });
});

app.get('/process', async (req, res) => {
    res.json({ "status": "Queue processing" });

    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats === '0') {
        reservationEnabled = false;
    }

    const newAvailableSeats = parseInt(availableSeats) - 1;
    await reserveSeat(newAvailableSeats);

    if (newAvailableSeats < 0) {
        return queue.create('reserve_seat').priority('high').save();
    }
});

app.listen(1245, () => {
    console.log('Server is running on port 1245');
});
