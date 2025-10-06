const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../routes/users');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

const mockUser = {
    oauthId: 'test_oauth_123',
    provider: 'github',
    name: 'Test User',
    email: 'test@example.com'
};

describe('User API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/trackstar-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('GET /users', () => {
        it('should get all users', async () => {
            await User.create(mockUser);
            
            const response = await request(app)
                .get('/users')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
        });
    });

    describe('GET /users/:id', () => {
        it('should get a single user by ID', async () => {
            const user = await User.create(mockUser);

            const response = await request(app)
                .get(`/users/${user._id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(mockUser.name);
        });
    });
});