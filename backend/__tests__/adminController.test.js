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

    describe('Delete User', () => {
        let userToDelete;

        beforeEach(async () => {
            userToDelete = new User({ email: 'deleteuser@example.com', password: 'password123', isAdmin: false });
            await userToDelete.save();
        });

        it('should allow admin to delete a user', async () => {
            const res = await request(app)
                .delete(`/users/${userToDelete._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'User deleted successfully');
        });

        it('should deny delete access to non-admin users', async () => {
            const res = await request(app)
                .delete(`/users/${userToDelete._id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admins only.');
        });

        it('should return 404 if the user to be deleted does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .delete(`/users/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });
    });

    describe('Update User', () => {
        let userToUpdate;

        beforeEach(async () => {
            userToUpdate = new User({ email: 'updateuser@example.com', password: 'password123', isAdmin: false });
            await userToUpdate.save();
        });

        it('should allow admin to update a user', async () => {
            const res = await request(app)
                .put(`/users/${userToUpdate._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ email: 'updated@example.com', password: 'newpassword123', isAdmin: true });

            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe('updated@example.com');
            expect(res.body.isAdmin).toBe(true);
        });

        it('should deny update access to non-admin users', async () => {
            const res = await request(app)
                .put(`/users/${userToUpdate._id}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ email: 'updated@example.com', password: 'newpassword123', isAdmin: true });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admins only.');
        });

        it('should return 404 if the user to be updated does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/users/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ email: 'updated@example.com', password: 'newpassword123', isAdmin: true });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'User not found');
        });
    });

    describe('Get All Users', () => {
        beforeEach(async () => {
            // Create multiple users to test retrieval
            await User.insertMany([
                { email: 'user1@example.com', password: 'password123', isAdmin: false },
                { email: 'user2@example.com', password: 'password123', isAdmin: false },
                { email: 'admin2@example.com', password: 'password123', isAdmin: true }
            ]);
        });

        it('should allow admin to get all users', async () => {
            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ email: 'user1@example.com' }),
                    expect.objectContaining({ email: 'user2@example.com' }),
                    expect.objectContaining({ email: 'admin2@example.com' })
                ])
            );
        });

        it('should deny access to non-admin users when getting all users', async () => {
            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', 'Access denied. Admins only.');
        });
    });

});
