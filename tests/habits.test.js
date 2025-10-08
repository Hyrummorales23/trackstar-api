const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const habitRoutes = require('../routes/habits');
const Habit = require('../models/Habit');
const User = require('../models/User');
const { connectTestDB, closeTestDB, clearTestDB } = require('./testHelpers');

const app = express();
app.use(express.json());
app.use('/habits', habitRoutes);

describe('Habits API', () => {
    let testUser;

    beforeAll(async () => {
        await connectTestDB();
        
        // Create a test user
        testUser = await User.create({
            oauthId: 'habit_test_user',
            provider: 'github',
            name: 'Habit Test User',
            email: 'habit@example.com'
        });
    }, 15000);

    afterAll(async () => {
        await closeTestDB();
    }, 15000);

    beforeEach(async () => {
        await clearTestDB();
        
        // Recreate test user after clearing
        testUser = await User.create({
            oauthId: 'habit_test_user',
            provider: 'github',
            name: 'Habit Test User',
            email: 'habit@example.com'
        });
    });

    describe('GET /habits', () => {
        it('should get all habits', async () => {
            await Habit.create({
                userId: testUser._id,
                name: 'Morning Exercise',
                description: '30 minutes of exercise',
                frequency: 'daily'
            });

            const response = await request(app)
                .get('/habits')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.data[0].name).toBe('Morning Exercise');
            expect(response.body.data[0].frequency).toBe('daily');
        });

        it('should return empty array when no habits', async () => {
            const response = await request(app)
                .get('/habits')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(0);
            expect(response.body.data).toEqual([]);
        });
    });

    describe('GET /habits/:id', () => {
        it('should get a single habit by ID', async () => {
            const habit = await Habit.create({
                userId: testUser._id,
                name: 'Reading',
                description: 'Read 30 minutes daily',
                frequency: 'daily'
            });

            const response = await request(app)
                .get(`/habits/${habit._id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe('Reading');
            expect(response.body.data.description).toBe('Read 30 minutes daily');
        });

        it('should return 404 for non-existent habit', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/habits/${fakeId}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Habit not found');
        });
    });
});