const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const jest = require('jest');

const { updateParameters, getParameters } = require('../controllers/parametersController');
const {describe, it, expect, beforeEach} = jest;

// Mock the fs and path modules
jest.mock('fs').promises;
jest.mock('path');

const app = express();
app.use(express.json());

// Set up routes for testing
app.post('/api/parameters/update', updateParameters);
app.get('/api/parameters', getParameters);

// Mock data
const mockParameters = {
    parameters: {
        "preset1": { threshold1: 0.5, threshold2: 0.8 },
    },
};

describe('Parameters Controller', () => {

    beforeEach(() => {
        // Mock the path to parameters.json
        path.join.mockReturnValue('/fake/path/parameters.json');
    });

    describe('updateParameters', () => {
        it('should update parameters successfully when valid data is provided', async () => {
            const newParameters = { threshold1: 0.6, threshold2: 0.9 };

            fs.readFile.mockResolvedValue(JSON.stringify(mockParameters));
            fs.writeFile.mockResolvedValue(undefined); // No return value expected from writeFile

            const res = await request(app)
                .post('/api/parameters/update')
                .send({
                    preset_name: 'preset1',
                    defekt_proportion_thresholds: newParameters,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Parameters updated successfully' });
            expect(fs.writeFile).toHaveBeenCalledWith(
                '/fake/path/parameters.json',
                JSON.stringify({ parameters: { preset1: newParameters } }, null, 4),
                'utf8'
            );
        });

        it('should return 400 if the preset is not found', async () => {
            const newParameters = { threshold1: 0.6, threshold2: 0.9 };

            fs.readFile.mockResolvedValue(JSON.stringify(mockParameters));

            const res = await request(app)
                .post('/api/parameters/update')
                .send({
                    preset_name: 'nonexistent_preset',
                    defekt_proportion_thresholds: newParameters,
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Preset is not found' });
        });

        it('should return 400 if the parameters are invalid', async () => {
            const invalidParameters = { threshold1: 1.5, threshold2: 0.9 };

            fs.readFile.mockResolvedValue(JSON.stringify(mockParameters));

            const res = await request(app)
                .post('/api/parameters/update')
                .send({
                    preset_name: 'preset1',
                    defekt_proportion_thresholds: invalidParameters,
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ message: 'Invalid parameters format or values out of range' });
        });

        it('should return 500 if there is an error reading or writing the file', async () => {
            fs.readFile.mockRejectedValue(new Error('File read error'));

            const res = await request(app)
                .post('/api/parameters/update')
                .send({
                    preset_name: 'preset1',
                    defekt_proportion_thresholds: { threshold1: 0.6, threshold2: 0.9 },
                });

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Error reading or writing file', error: {} });
        });
    });

    describe('getParameters', () => {
        it('should return the parameters successfully', async () => {
            fs.readFile.mockResolvedValue(JSON.stringify(mockParameters));

            const res = await request(app).get('/api/parameters');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockParameters.parameters);
        });

        it('should return 500 if there is an error reading the file', async () => {
            fs.readFile.mockRejectedValue(new Error('File read error'));

            const res = await request(app).get('/api/parameters');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Error reading parameters file', error: {} });
        });
    });
});
