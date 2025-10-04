const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The task title
 *         description:
 *           type: string
 *           description: The task description
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The due date of the task
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: The priority level of the task
 *         isCompleted:
 *           type: boolean
 *           description: Whether the task is completed
 *         category:
 *           type: string
 *           description: The category of the task
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of all tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get("/", (req, res) => {
  /*  
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Get all tasks'
    #swagger.description = 'Retrieve all tasks in the system.'
  */
  getAllTasks(req, res);
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Get a specific task by ID'
    #swagger.description = 'Retrieve details of a specific task by its ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Task ID',
      required: true,
      type: 'string'
    }
  */
  getTaskById(req, res);
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 */
router.post("/", (req, res) => {
  /*  
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Create a new task'
    #swagger.description = 'Create a new task in the system.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Task information',
      required: true,
      schema: {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the TrackStar API',
        dueDate: '2024-12-31',
        priority: 'high',
        category: 'work'
      }
    }
  */
  createTask(req, res);
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               isCompleted:
 *                 type: boolean
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       400:
 *         description: Validation error
 */
router.put("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Update an existing task'
    #swagger.description = 'Update details of an existing task by its ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Task ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated task information',
      required: true,
      schema: {
        title: 'Updated task title',
        description: 'Updated description',
        priority: 'medium',
        isCompleted: true,
        category: 'personal'
      }
    }
  */
  updateTask(req, res);
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Delete a task'
    #swagger.description = 'Delete a specific task by its ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Task ID',
      required: true,
      type: 'string'
    }
  */
  deleteTask(req, res);
});

module.exports = router;