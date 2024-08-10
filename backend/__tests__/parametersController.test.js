const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { updateParameters, getParameters } = require('../controllers/parametersController');

// Mock the fs module using jest.mock
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
    },
}));

// Set up an Express app for testing
const app = express();
app.use(express.json());

app.post('/parameters/update', updateParameters);
app.get('/parameters', getParameters);

describe('Parameters Controller', () => {

    describe('GET /parameters', () => {
        it('should return the parameters from the file', async () => {
            const mockData = JSON.stringify({ preset1: { threshold1: 0.5 } });
            fs.readFile.mockResolvedValue(mockData);

            const res = await request(app).get('/parameters');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ preset1: { threshold1: 0.5 } });
            expect(fs.readFile).toHaveBeenCalledWith(path.join(__dirname, '../models/parameters.json'), 'utf8');
        });

        it('should handle errors while reading the parameters file', async () => {
            fs.readFile.mockRejectedValue(new Error('File read error'));

            const res = await request(app).get('/parameters');

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Error reading parameters file');
        });
    });

    describe('POST /parameters/update', () => {
        const mockParameters = {
            preset1: { threshold1: 0.5, threshold2: 0.8 },
        };

        const mockSchema = {
            thresholds: {
                threshold1: { type: 'number', min: 0, max: 1 },
                threshold2: { type: 'number', min: 0, max: 1 },
            },
        };

        beforeEach(() => {
            jest.resetModules();
            jest.clearAllMocks();
            jest.mock('../models/parameters', () => mockSchema);
        });

        it('should update the parameters if valid', async () => {
            fs.readFile.mockResolvedValue(JSON.stringify(mockParameters));
            const updatedThresholds = { threshold1: 0.6, threshold2: 0.7 };

            const res = await request(app)
                .post('/parameters/update')
                .send({ preset_name: 'preset1', defekt_proportion_thresholds: updatedThresholds });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Parameters updated successfully');
            expect(fs.writeFile).toHaveBeenCalledWith(
                path.join(__dirname, '../models/parameters.json'),
                JSON.stringify({
                    preset1: updatedThresholds,
                }, null, 4),
                'utf8'
            );
        });

        it('should return 400 if the preset is not found', async () => {
            fs.readFile.mockResolvedValue(JSON.stringify(mockParameters));

            const res = await request(app)
                .post('/parameters/update')
                .send({ preset_name: 'preset2', defekt_proportion_thresholds: { threshold1: 0.5, threshold2: 0.7 } });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Preset is not found');
        });

        it('should return 400 if the parameters are invalid', async () => {
            fs.readFile.mockResolvedValue(JSON.stringify(mockParameters));

            const res = await request(app)
                .post('/parameters/update')
                .send({ preset_name: 'preset1', defekt_proportion_thresholds: { threshold1: 1.5, threshold2: 2 } });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid parameters format or values out of range');
        });

        it('should handle errors while reading or writing the file', async () => {
            fs.readFile.mockRejectedValue(new Error('File read error'));

            const res = await request(app)
                .post('/parameters/update')
                .send({ preset_name: 'preset1', defekt_proportion_thresholds: { threshold1: 0.5, threshold2: 0.7 } });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Error reading or writing file');
        });
    });
});
