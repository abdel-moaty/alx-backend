import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
    let queue;

    beforeEach(() => {
        queue = kue.createQueue();
        queue.testMode.enter();
    });

    afterEach(() => {
        queue.testMode.clear();
        queue.testMode.exit();
    });

    it('should throw an error if jobs is not an array', () => {
        expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
    });

    it('should create two new jobs in the queue', () => {
        const jobs = [
            { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
            { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' }
        ];

        createPushNotificationsJobs(jobs, queue);

        expect(Object.keys(queue.testMode.jobs)).to.have.lengthOf(2);
    });
});
