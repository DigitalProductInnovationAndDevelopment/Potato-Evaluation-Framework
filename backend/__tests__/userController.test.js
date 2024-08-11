const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const { getAllUsers, loginUser } = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

// Set up an Express app for testing
const app = express();
app.use(express.json());

// Apply auth middleware
app.get('/users', auth, getAllUsers);
app.post('/login', loginUser);

let mongoServer;

const email = 'test@example.com';
const password = 'password123';
const JWT_SECRET = 'test_secret';
let validToken;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {});

    process.env.JWT_SECRET = JWT_SECRET;

    const user = new User({ email: email, password: password, isAdmin: false });
    await user.save();

    // Generate a valid token for authentication
    validToken = jwt.sign({ email: email, id: user._id }, JWT_SECRET);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User Controller with Auth Middleware', () => {

    describe('GET /users', () => {
        it('should return a list of all users with valid token', async () => {
            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].email).toBe(email);
        });

        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/users');
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Access denied. No token provided.');
        });

        it('should handle errors', async () => {
            jest.spyOn(User, 'find').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.statusCode).toBe(500);
        });
    });

    describe('POST /login', () => {
        it('should return a token for valid credentials', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: email, password: password });

            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            const decodedToken = jwt.verify(res.body.token, process.env.JWT_SECRET);
            expect(decodedToken.email).toBe(email);
        });

        it('should return 404 if user not found', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: 'nonexistent@example.com', password: 'password123' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('User not found');
        });

        it('should return 401 for invalid password', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: email, password: 'wrongpassword' });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Invalid password');
        });

        it('should handle errors during login', async () => {
            jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Error logging in');
        });
    });
});
