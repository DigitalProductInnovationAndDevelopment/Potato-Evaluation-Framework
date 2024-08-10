const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { createTrackingHistory, getLatestTrackingHistory } = require('../controllers/trackingHistoryController');
const TrackingHistoryModel = require('../models/TrackingHistory');

// Set up an Express app for testing
const app = express();
app.use(express.json());

app.post('/tracking-history', createTrackingHistory);
app.get('/tracking-history', getLatestTrackingHistory);

// Optional: Set up an in-memory MongoDB instance using `mongodb-memory-server`
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await TrackingHistoryModel.deleteMany({});
});

describe('Tracking History Controller', () => {

    describe('POST /tracking-history', () => {
        it('should create a new tracking history record', async () => {
            const trackingHistorySchema = {
                goodPotatoes: 100,
                badPotatoes: 20,
                greening: 2,
                dryRot: 3,
                wetRot: 1,
                wireWorm: 0,
                malformed: 4,
                growthCrack: 5,
                mechanicalDamage: 2,
                dirtClod: 3,
                stone: 1,
                trackingDate: new Date(),
            };

            const res = await request(app)
                .post('/tracking-history')
                .send({ trackingHistorySchema });

            // to make it comparable
            res.body.trackingDate = new Date(res.body.trackingDate);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toMatchObject(trackingHistorySchema);
        });

        it('should return 500 if there is an error during creation', async () => {
            jest.spyOn(TrackingHistoryModel.prototype, 'save').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const trackingHistorySchema = {
                goodPotatoes: 100,
                badPotatoes: 20,
                greening: 2,
                dryRot: 3,
                wetRot: 1,
                wireWorm: 0,
                malformed: 4,
                growthCrack: 5,
                mechanicalDamage: 2,
                dirtClod: 3,
                stone: 1,
                trackingDate: new Date(),
            };

            const res = await request(app)
                .post('/tracking-history')
                .send({ trackingHistorySchema });

            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toBe('Database error');
        });
    });

    describe('GET /tracking-history', () => {
        it('should return the latest tracking history record', async () => {
            const trackingHistory1 = new TrackingHistoryModel({
                goodPotatoes: 80,
                badPotatoes: 15,
                greening: 1,
                dryRot: 1,
                wetRot: 0,
                wireWorm: 0,
                malformed: 2,
                growthCrack: 3,
                mechanicalDamage: 1,
                dirtClod: 2,
                stone: 0,
                trackingDate: new Date('2023-08-01'),
            });
            const trackingHistory2 = new TrackingHistoryModel({
                goodPotatoes: 90,
                badPotatoes: 10,
                greening: 2,
                dryRot: 2,
                wetRot: 1,
                wireWorm: 0,
                malformed: 3,
                growthCrack: 4,
                mechanicalDamage: 2,
                dirtClod: 3,
                stone: 1,
                trackingDate: new Date('2023-08-10'),
            });

            await trackingHistory1.save();
            await trackingHistory2.save();

            const res = await request(app).get('/tracking-history');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0]).toHaveProperty('goodPotatoes', 90);
            expect(res.body[0]).toHaveProperty('badPotatoes', 10);
            expect(res.body[0]).toHaveProperty('trackingDate');
        });

        it('should return 500 if there is an error during retrieval', async () => {
            jest.spyOn(TrackingHistoryModel, 'find').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app).get('/tracking-history');

            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toBe('Database error');
        });
    });
});
