const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { createUser, getAllUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { auth, adminOnly } = require('../middlewares/auth');
const User = require('../models/User');

const JWT_SECRET = 'test_secret';

const app = express();
app.use(bodyParser.json());

// Mock environment variables
process.env.JWT_SECRET = JWT_SECRET;
process.env.ADMIN_EMAIL = 'admin@example.com';

// Setup routes with middlewares
app.post('/users', auth, adminOnly, createUser);
app.get('/users', auth, adminOnly, getAllUsers);
app.put('/users/:id', auth, adminOnly, updateUser);
app.delete('/users/:id', auth, adminOnly, deleteUser);

describe('User Controller with Auth Middleware', () => {
    let mongoServer;
    let userToken;
    let adminToken;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), {});

        // Create a regular user and an admin user
        const user = new User({ email: 'user@example.com', password: 'password123', isAdmin: false });
        const admin = new User({ email: 'admin@example.com', password: 'password123', isAdmin: true });

        await user.save();
        await admin.save();

        // Generate tokens
        userToken = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        adminToken = jwt.sign({ email: admin.email, isAdmin: admin.isAdmin }, process.env.JWT_SECRET);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    describe('Protected Routes', () => {
        it('should deny access if no token is provided', async () => {
            const res = await request(app).get('/users');
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Access denied. No token provided.');
        });

        it('should deny access if an invalid token is provided', async () => {
            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer invalidtoken`);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        it('should deny access to non-admin users', async () => {
            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admins only.');
        });

        it('should allow access to admin users', async () => {
            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
        });

        it('should create a new user when an admin user is authenticated', async () => {
            const res = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ email: 'newuser@example.com', password: 'password123', isAdmin: false });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.email).toBe('newuser@example.com');
        });

        it('should not create a new user when a non-admin user is authenticated', async () => {
            const res = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ email: 'newuser@example.com', password: 'password123', isAdmin: false });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admins only.');
        });
    });
});
