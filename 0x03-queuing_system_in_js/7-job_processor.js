import kue from 'kue';

const blacklistedNumbers = ['4153518780', '4153518781'];

const sendNotification = (phoneNumber, message, job, done) => {
    job.progress(0, 100);

    if (blacklistedNumbers.includes(phoneNumber)) {
        return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }

    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    job.progress(100);
    done();
};

const queue = kue.createQueue({ concurrency: 2 });

queue.process('push_notification_code_2', 2, (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message, job, done);
});
