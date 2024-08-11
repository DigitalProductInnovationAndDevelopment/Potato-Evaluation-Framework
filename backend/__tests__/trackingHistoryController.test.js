const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createTrackingHistory, getLatestTrackingHistory } = require('../controllers/trackingHistoryController');
const TrackingHistoryModel = require('../models/TrackingHistory');
const { auth } = require('../middlewares/auth');

// Set up an Express app for testing
const app = express();
app.use(express.json());

// Apply auth middleware
app.post('/tracking-history', auth, createTrackingHistory);
app.get('/tracking-history', auth, getLatestTrackingHistory);

let mongoServer;

// Mock JWT secret and token generation
const JWT_SECRET = 'testsecret';
const validToken = jwt.sign({ id: 'testUserId' }, JWT_SECRET);

// Setup MongoDB memory server
beforeAll(async () => {
    process.env.JWT_SECRET = JWT_SECRET;
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await TrackingHistoryModel.deleteMany({});
});

describe('Tracking History Controller with Auth Middleware', () => {
    describe('POST /tracking-history', () => {
        it('should create a new tracking history record with valid token', async () => {
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
                .set('Authorization', `Bearer ${validToken}`)
                .send(trackingHistorySchema);

            // to make it comparable for expect statement
            res.body.trackingDate = new Date(res.body.trackingDate);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toMatchObject(trackingHistorySchema);
        });

        it('should return 401 if no token is provided', async () => {
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
                .send(trackingHistorySchema);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        });

        it('should return 500 if there is an error during creation', async () => {
            jest.spyOn(TrackingHistoryModel.prototype, 'save').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .post('/tracking-history')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ goodPotatoes: 100 });

            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toBe('Database error');
        });
    });

    describe('GET /tracking-history', () => {
        it('should return the latest tracking history record with valid token', async () => {
            const trackingHistory1 = new TrackingHistoryModel({
                goodPotatoes: 80,
                badPotatoes: 15,
                trackingDate: new Date('2023-08-01'),
            });
            const trackingHistory2 = new TrackingHistoryModel({
                goodPotatoes: 90,
                badPotatoes: 10,
                trackingDate: new Date('2023-08-10'),
            });

            await trackingHistory1.save();
            await trackingHistory2.save();

            const res = await request(app)
                .get('/tracking-history')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0]).toHaveProperty('goodPotatoes', 90);
            expect(res.body[0]).toHaveProperty('badPotatoes', 10);
        });

        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/tracking-history');

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        });

        it('should return 500 if there is an error during retrieval', async () => {
            jest.spyOn(TrackingHistoryModel, 'find').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .get('/tracking-history')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toBe('Database error');
        });
    });
});
