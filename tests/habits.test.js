const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const habitRoutes = require('../routes/habits');
const Habit = require('../models/Habit');

const app = express();
app.use(express.json());
app.use('/habits', habitRoutes);

const mockHabit = {
    userId: new mongoose.Types.ObjectId(),
    name: 'Test Habit',
    description: 'Test Habit Description',
    frequency: 'daily',
    targetCount: 1,
    category: 'health'
};

describe('Habit API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/trackstar-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Habit.deleteMany({});
    });

    describe('GET /habits', () => {
        it('should get all habits', async () => {
            await Habit.create(mockHabit);
            
            const response = await request(app)
                .get('/habits')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.data[0].name).toBe(mockHabit.name);
        });
    });

    describe('GET /habits/:id', () => {
        it('should get a single habit by ID', async () => {
            const habit = await Habit.create(mockHabit);

            const response = await request(app)
                .get(`/habits/${habit._id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(mockHabit.name);
        });
    });
});