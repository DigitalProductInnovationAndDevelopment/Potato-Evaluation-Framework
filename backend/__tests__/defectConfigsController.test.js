const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const DefectConfigModel = require('../models/DefectConfigModel');
const defectConfigRoutes = require('../routes/defectConfigRoutes');

// Set up an Express app for testing
const app = express();
app.use(express.json());
app.use('/defect-config', defectConfigRoutes);

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
        it('should return the defect configuration', async () => {
            const res = await request(app).get('/defect-config');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('greening', 0.1);
            expect(res.body).toHaveProperty('dryRot', 0.2);
            expect(res.body).toHaveProperty('wetRot', 0.3);
            expect(res.body).toHaveProperty('wireWorm', 0.4);
            expect(res.body).toHaveProperty('malformed', 0.5);
            expect(res.body).toHaveProperty('growthCrack', 0.6);
            expect(res.body).toHaveProperty('mechanicalDamage', 0.7);
            expect(res.body).toHaveProperty('dirtClod', 0.8);
            expect(res.body).toHaveProperty('stone', 0.9);
        });
    });

    describe('POST /defect-config', () => {
        it('should update the defect configuration successfully', async () => {
            const updateData = {
                greening: 0.15,
                dryRot: 0.25,
                wetRot: 0.35,
            };

            const res = await request(app)
                .post('/defect-config')
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Defect configuration updated successfully');
            expect(res.body.data.greening).toBe(0.15);
            expect(res.body.data.dryRot).toBe(0.25);
            expect(res.body.data.wetRot).toBe(0.35);
        });

        it('should return 404 if no defect configuration exists', async () => {
            await DefectConfigModel.deleteMany({});

            const res = await request(app)
                .post('/defect-config')
                .send({ greening: 0.15 });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Defect configuration not found');
        });

        it('should return 500 if validation fails', async () => {
            const invalidUpdateData = {
                greening: 1.5, // Invalid: exceeds max value of 1
            };

            const res = await request(app)
                .post('/defect-config')
                .send(invalidUpdateData);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Error updating defect configuration');
            expect(res.body.error).toContain('validation failed');
        });
    });
});
