const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('../routes/tasks');
const Task = require('../models/Task');
const User = require('../models/User');
const { connectTestDB, closeTestDB, clearTestDB } = require('./testHelpers');

const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);

describe('Task API', () => {
    let testUser;

    beforeAll(async () => {
        await connectTestDB();
        
        // Create a test user for task ownership
        testUser = await User.create({
            oauthId: 'task_test_user',
            provider: 'github',
            name: 'Task Test User',
            email: 'task@example.com'
        });
    }, 15000);

    afterAll(async () => {
        await closeTestDB();
    }, 15000);

    beforeEach(async () => {
        await clearTestDB();
        
        // Recreate test user after clearing
        testUser = await User.create({
            oauthId: 'task_test_user',
            provider: 'github',
            name: 'Task Test User',
            email: 'task@example.com'
        });
    });

    describe('GET /tasks', () => {
        it('should get all tasks', async () => {
            await Task.create({
                userId: testUser._id,
                title: 'Test Task',
                description: 'Test Description',
                priority: 'medium'
            });

            const response = await request(app)
                .get('/tasks')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.data[0].title).toBe('Test Task');
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
            const task = await Task.create({
                userId: testUser._id,
                title: 'Single Task',
                description: 'Single Task Description',
                priority: 'high'
            });

            const response = await request(app)
                .get(`/tasks/${task._id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe('Single Task');
            expect(response.body.data.priority).toBe('high');
        });

        it('should return 404 for non-existent task', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/tasks/${fakeId}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Task not found');
        });
    });
});