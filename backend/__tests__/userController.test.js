const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { getAllUsers, loginUser } = require('../controllers/userController');
const User = require('../models/User');

// Set up an Express app for testing
const app = express();
app.use(express.json());

app.get('/users', getAllUsers);
app.post('/login', loginUser);

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
    await User.deleteMany({});
});

describe('User Controller', () => {

    describe('GET /users', () => {
        it('should return a list of all users', async () => {
            const user = new User({ email: 'test@example.com', password: 'password123', isAdmin: false });
            await user.save();

            const res = await request(app).get('/users');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].email).toBe('test@example.com');
        });

        it('should handle errors', async () => {
            jest.spyOn(User, 'find').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app).get('/users');
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('POST /login', () => {
        it('should return a token for valid credentials', async () => {
            const user = new User({ email: 'test@example.com', password: 'password123', isAdmin: false });
            await user.save();

            const res = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();

            const decodedToken = jwt.verify(res.body.token, process.env.JWT_SECRET);
            expect(decodedToken.email).toBe('test@example.com');
        });

        it('should return 404 if user not found', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: 'nonexistent@example.com', password: 'password123' });

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe('User not found');
        });

        it('should return 401 for invalid password', async () => {
            const user = new User({ email: 'test@example.com', password: 'password123', isAdmin: false });
            await user.save();

            const res = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('Invalid password');
        });

        it('should handle errors during login', async () => {
            jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password123' });

            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toBe('Error logging in');
        });
    });
});
