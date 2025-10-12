const express = require("express");
const router = express.Router();
const {
  getAllHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit,
} = require("../controllers/habitController");
const { requireAuth } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Habit:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the habit
 *         name:
 *           type: string
 *           description: The habit name
 *         description:
 *           type: string
 *           description: The habit description
 *         frequency:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           description: How often the habit should be performed
 *         targetCount:
 *           type: integer
 *           description: Target number of completions
 *         isActive:
 *           type: boolean
 *           description: Whether the habit is active
 *         category:
 *           type: string
 *           description: The category of the habit
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /habits:
 *   get:
 *     summary: Get all habits
 *     tags: [Habits]
 *     responses:
 *       200:
 *         description: List of all habits
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
 *                     $ref: '#/components/schemas/Habit'
 */
router.get("/", (req, res) => {
  /*  
    #swagger.tags = ['Habits']
    #swagger.summary = 'Get all habits for the current user'
    #swagger.description = 'Retrieve all habits belonging to the authenticated user.'
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: false,
      type: 'string'
    }
  */
  getAllHabits(req, res);
});

/**
 * @swagger
 * /habits/{id}:
 *   get:
 *     summary: Get a habit by ID
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The habit ID
 *     responses:
 *       200:
 *         description: Habit details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       404:
 *         description: Habit not found
 */
router.get("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Habits']
    #swagger.summary = 'Get a specific habit by ID'
    #swagger.description = 'Retrieve details of a specific habit by its ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Habit ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: false,
      type: 'string'
    }
  */
  getHabitById(req, res);
});

/**
 * @swagger
 * /habits:
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *               targetCount:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Habit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Validation error
 */
router.post("/", requireAuth, (req, res) => {
  /*  
    #swagger.tags = ['Habits']
    #swagger.summary = 'Create a new habit'
    #swagger.description = 'Create a new habit for the authenticated user.'
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: false,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Habit information',
      required: true,
      schema: {
        userId: '671b123456789abcdef12345',
        name: 'Daily Exercise',
        description: 'Do 30 minutes of exercise daily',
        frequency: 'daily',
        targetCount: 1,
        category: 'health',
        isActive: true
      }
    }
  */
  createHabit(req, res);
});

/**
 * @swagger
 * /habits/{id}:
 *   put:
 *     summary: Update a habit
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The habit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *               targetCount:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *       404:
 *         description: Habit not found
 *       400:
 *         description: Validation error
 */
router.put("/:id", requireAuth, (req, res) => {
  /*  
    #swagger.tags = ['Habits']
    #swagger.summary = 'Update an existing habit'
    #swagger.description = 'Update details of an existing habit by its ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Habit ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: false,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated habit information',
      required: true,
      schema: {
        name: 'Updated habit name',
        description: 'Updated description',
        frequency: 'weekly',
        targetCount: 3,
        category: 'updated-category',
        isActive: false
      }
    }
  */
  updateHabit(req, res);
});

/**
 * @swagger
 * /habits/{id}:
 *   delete:
 *     summary: Delete a habit
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The habit ID
 *     responses:
 *       200:
 *         description: Habit deleted successfully
 *       404:
 *         description: Habit not found
 */
router.delete("/:id", requireAuth, (req, res) => {
  /*  
    #swagger.tags = ['Habits']
    #swagger.summary = 'Delete a habit'
    #swagger.description = 'Delete a specific habit by its ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Habit ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: false,
      type: 'string'
    }
  */
  deleteHabit(req, res);
});

module.exports = router;
