// tests/tasks.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('../routes/tasks');
const Task = require('../models/Task');

const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);

// Mock data that matches the Task schema
const mockTask = {
    userId: new mongoose.Types.ObjectId(),
    title: 'Test Task',
    description: 'Test Description',
    priority: 'medium',
    category: 'test'
};

describe('Task API', () => {
    beforeAll(async () => {
        // Connect to a test database
        await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/trackstar-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Task.deleteMany({});
    });

    describe('GET /tasks', () => {
        it('should get all tasks', async () => {
            await Task.create(mockTask);
            
            const response = await request(app)
                .get('/tasks')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.data[0].title).toBe(mockTask.title);
        });

        it('should return empty array when no tasks exist', async () => {
            const response = await request(app)
                .get('/tasks')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(0);
            expect(response.body.data).toEqual([]);
        });
    });

    describe('GET /tasks/:id', () => {
        it('should get a single task by ID', async () => {
            const task = await Task.create(mockTask);

            const response = await request(app)
                .get(`/tasks/${task._id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe(mockTask.title);
        });

        it('should return 404 for non-existent task', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/tasks/${fakeId}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Task not found');
        });
    });
});