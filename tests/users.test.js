const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../routes/users');
const User = require('../models/User');
const { connectTestDB, closeTestDB, clearTestDB } = require('./testHelpers');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('Users API', () => {
    beforeAll(async () => {
        await connectTestDB();
    }, 15000); // 15 second timeout for setup

    afterAll(async () => {
        await closeTestDB();
    }, 15000); // 15 second timeout for cleanup

    beforeEach(async () => {
        await clearTestDB();
    });

    describe('GET /users', () => {
        it('should get all users', async () => {
            // Create a test user
            await User.create({
                oauthId: 'test123',
                provider: 'github',
                name: 'Test User',
                email: 'test@example.com'
            });

            const response = await request(app)
                .get('/users')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.data[0].name).toBe('Test User');
        });

        it('should return empty array when no users', async () => {
            const response = await request(app)
                .get('/users')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(0);
            expect(response.body.data).toEqual([]);
        });
    });

    describe('GET /users/:id', () => {
        it('should get a single user by ID', async () => {
            const user = await User.create({
                oauthId: 'test456',
                provider: 'github',
                name: 'Single User',
                email: 'single@example.com'
            });

            const response = await request(app)
                .get(`/users/${user._id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe('Single User');
            expect(response.body.data.email).toBe('single@example.com');
        });

        it('should return 404 for non-existent user', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/users/${fakeId}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('User not found');
        });
    });
});