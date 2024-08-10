const request = require('supertest');
const express = require('express');
const { getAllUsers, loginUser } = require('../controllers/userController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {jest} = require("globals");

const {describe, it, expect} = jest;

// Mock the User model and jwt
jest.mock('../models/User');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

// Set up routes for testing
app.get('/api/users', getAllUsers);
app.post('/api/login', loginUser);

describe('User Controller', () => {
    describe('getAllUsers', () => {
        it('should return a list of users', async () => {
            const mockUsers = [
                { _id: '1', email: 'user1@example.com', password: 'password1' },
                { _id: '2', email: 'user2@example.com', password: 'password2' },
            ];
            User.find.mockResolvedValue(mockUsers);

            const res = await request(app).get('/api/users');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockUsers);
        });

        it('should return a 500 error if something goes wrong', async () => {
            User.find.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/users');

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({});
        });
    });

    describe('loginUser', () => {
        it('should return a token if the login is successful', async () => {
            const mockUser = {
                _id: '1',
                email: 'user1@example.com',
                password: 'password1',
                isAdmin: false,
            };

            User.findOne.mockResolvedValue(mockUser);
            jwt.sign.mockReturnValue('fake-jwt-token');

            const res = await request(app)
                .post('/api/login')
                .send({ email: 'user1@example.com', password: 'password1' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token', 'fake-jwt-token');
        });

        it('should return a 404 error if the user is not found', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/login')
                .send({ email: 'user1@example.com', password: 'password1' });

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({ message: 'User not found' });
        });

        it('should return a 401 error if the password is incorrect', async () => {
            const mockUser = {
                _id: '1',
                email: 'user1@example.com',
                password: 'password1',
                isAdmin: false,
            };

            User.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/login')
                .send({ email: 'user1@example.com', password: 'wrong-password' });

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({ message: 'Invalid password' });
        });

        it('should return a 500 error if there is an error during login', async () => {
            User.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/api/login')
                .send({ email: 'user1@example.com', password: 'password1' });

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ message: 'Error logging in', error: {} });
        });
    });
});
