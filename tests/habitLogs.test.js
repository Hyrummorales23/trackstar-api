const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const habitLogRoutes = require('../routes/habitLogs');
const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');

const app = express();
app.use(express.json());
app.use('/habit-logs', habitLogRoutes);

describe('HabitLog API', () => {
    let testHabit;
    let mockHabitLog;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/trackstar-test');
        
        // Create a test habit first
        testHabit = await Habit.create({
            userId: new mongoose.Types.ObjectId(),
            name: 'Test Habit for Logs',
            frequency: 'daily'
        });

        mockHabitLog = {
            habitId: testHabit._id,
            userId: testHabit.userId,
            completedDate: new Date(),
            completionCount: 1
        };
    });

    afterAll(async () => {
        await Habit.deleteMany({});
        await HabitLog.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await HabitLog.deleteMany({});
    });

    describe('GET /habit-logs', () => {
        it('should get all habit logs with user header', async () => {
            await HabitLog.create(mockHabitLog);
            
            const response = await request(app)
                .get('/habit-logs')
                .set('x-user-id', mockHabitLog.userId.toString())
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    describe('GET /habit-logs/:id', () => {
        it('should get a single habit log by ID with user header', async () => {
            const habitLog = await HabitLog.create(mockHabitLog);

            const response = await request(app)
                .get(`/habit-logs/${habitLog._id}`)
                .set('x-user-id', mockHabitLog.userId.toString())
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });
});