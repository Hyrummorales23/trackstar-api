const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const habitLogRoutes = require('../routes/habitLogs');
const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');
const User = require('../models/User');
const { connectTestDB, closeTestDB, clearTestDB } = require('./testHelpers');

const app = express();
app.use(express.json());
app.use('/habit-logs', habitLogRoutes);

describe('Habit Logs API', () => {
    let testUser, testHabit;

    beforeAll(async () => {
        await connectTestDB();
        
        testUser = await User.create({
            oauthId: 'log_test_user',
            provider: 'github',
            name: 'Log Test User',
            email: 'log@example.com'
        });

        testHabit = await Habit.create({
            userId: testUser._id,
            name: 'Test Habit',
            frequency: 'daily'
        });
    }, 15000);

    afterAll(async () => {
        await closeTestDB();
    }, 15000);

    beforeEach(async () => {
        await clearTestDB();
        
        // Recreate test data after clearing
        testUser = await User.create({
            oauthId: 'log_test_user',
            provider: 'github',
            name: 'Log Test User',
            email: 'log@example.com'
        });

        testHabit = await Habit.create({
            userId: testUser._id,
            name: 'Test Habit',
            frequency: 'daily'
        });
    });

    describe('GET /habit-logs', () => {
        it('should get all habit logs', async () => {
            await HabitLog.create({
                habitId: testHabit._id,
                userId: testUser._id,
                completedDate: new Date(),
                completionCount: 1
            });

            const response = await request(app)
                .get('/habit-logs')
                .set('x-user-id', testUser._id.toString())
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.data[0].completionCount).toBe(1);
        });

        it('should return empty array when no habit logs', async () => {
            const response = await request(app)
                .get('/habit-logs')
                .set('x-user-id', testUser._id.toString())
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(0);
            expect(response.body.data).toEqual([]);
        });
    });

    describe('GET /habit-logs/:id', () => {
        it('should get a single habit log by ID', async () => {
            const habitLog = await HabitLog.create({
                habitId: testHabit._id,
                userId: testUser._id,
                completedDate: new Date(),
                completionCount: 1,
                notes: 'Test completion'
            });

            const response = await request(app)
                .get(`/habit-logs/${habitLog._id}`)
                .set('x-user-id', testUser._id.toString())
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.completionCount).toBe(1);
            expect(response.body.data.notes).toBe('Test completion');
        });

        it('should return 404 for non-existent habit log', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/habit-logs/${fakeId}`)
                .set('x-user-id', testUser._id.toString())
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Habit log not found');
        });
    });
});