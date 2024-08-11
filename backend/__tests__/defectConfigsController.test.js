const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const DefectConfigModel = require('../models/DefectConfigModel');
const { getDefectConfig, updateDefectConfig } = require('../controllers/defectConfigsController');
const { auth } = require('../middlewares/auth');

// Set up an Express app for testing
const app = express();
app.use(express.json());

// Apply auth middleware
app.get('/defect-config', auth, getDefectConfig);
app.post('/defect-config', auth, updateDefectConfig);

const JWT_SECRET = 'test_secret';

let mongoServer;
let userToken;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {});
    process.env.JWT_SECRET = JWT_SECRET;
    // Generate a mock token for a regular user
    userToken = jwt.sign({ email: 'user@example.com', isAdmin: false }, process.env.JWT_SECRET);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await DefectConfigModel.deleteMany({});
    // Seed with a default config
    await DefectConfigModel.create({
        greening: 0.1,
        dryRot: 0.2,
        wetRot: 0.3,
        wireWorm: 0.4,
        malformed: 0.5,
        growthCrack: 0.6,
        mechanicalDamage: 0.7,
        dirtClod: 0.8,
        stone: 0.9,
    });
});

describe('Defect Config Endpoints', () => {
    describe('GET /defect-config', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/defect-config');
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        });

        it('should return 200 and the defect config if token is valid', async () => {
            const res = await request(app)
                .get('/defect-config')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.objectContaining({
                greening: 0.1,
                dryRot: 0.2,
                wetRot: 0.3,
                wireWorm: 0.4,
                malformed: 0.5,
                growthCrack: 0.6,
                mechanicalDamage: 0.7,
                dirtClod: 0.8,
                stone: 0.9,
            }));
        });
    });

    describe('POST /defect-config', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .post('/defect-config')
                .send({ greening: 0.15 });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        });

        it('should update the defect config if token is valid', async () => {
            const updateData = {
                greening: 0.15,
                dryRot: 0.25,
            };

            const res = await request(app)
                .post('/defect-config')
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Defect configuration updated successfully');
            expect(res.body.data).toEqual(expect.objectContaining(updateData));

            const updatedConfig = await DefectConfigModel.findOne();
            expect(updatedConfig.greening).toBe(0.15);
            expect(updatedConfig.dryRot).toBe(0.25);
        });

        it('should return 404 if defect config not found', async () => {
            await DefectConfigModel.deleteMany({});

            const res = await request(app)
                .post('/defect-config')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ greening: 0.15 });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Defect configuration not found');
        });

        it('should handle errors during update', async () => {
            jest.spyOn(DefectConfigModel.prototype, 'save').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .post('/defect-config')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ greening: 0.15 });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Error updating defect configuration');
        });
    });
});
