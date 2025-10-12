const express = require("express");
const router = express.Router();
const {
  getAllHabitLogs,
  getHabitLogById,
  createHabitLog,
  updateHabitLog,
  deleteHabitLog,
  getHabitStats,
} = require("../controllers/habitLogController");

/**
 * @swagger
 * components:
 *   schemas:
 *     HabitLog:
 *       type: object
 *       required:
 *         - habitId
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the habit log
 *         habitId:
 *           type: string
 *           description: Reference to the habit
 *         userId:
 *           type: string
 *           description: Reference to the user
 *         completedDate:
 *           type: string
 *           format: date-time
 *           description: Date when the habit was completed
 *         completionCount:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Number of times the habit was completed
 *         notes:
 *           type: string
 *           description: Optional notes about the completion
 *         mood:
 *           type: string
 *           enum: [excellent, good, okay, difficult, struggling]
 *           description: User's mood during completion
 *         difficulty:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Difficulty rating (1-5)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /habit-logs:
 *   get:
 *     summary: Get all habit logs for current user
 *     tags: [Habit Logs]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: string
 *         description: User ID (temporary for testing)
 *       - in: query
 *         name: habitId
 *         schema:
 *           type: string
 *         description: Filter by specific habit ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs until this date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Maximum number of logs to return
 *     responses:
 *       200:
 *         description: List of habit logs
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
 *                     $ref: '#/components/schemas/HabitLog'
 *       401:
 *         description: User not authenticated
 */
router.get("/", (req, res) => {
  /*  
    #swagger.tags = ['Habit Logs']
    #swagger.summary = 'Get all habit logs for current user'
    #swagger.description = 'Retrieve all habit completion logs for the authenticated user with optional filtering.'
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: true,
      type: 'string'
    }
    #swagger.parameters['habitId'] = {
      in: 'query',
      description: 'Filter by specific habit ID',
      required: false,
      type: 'string'
    }
    #swagger.parameters['startDate'] = {
      in: 'query',
      description: 'Filter logs from this date',
      required: false,
      type: 'string'
    }
    #swagger.parameters['endDate'] = {
      in: 'query',
      description: 'Filter logs until this date',
      required: false,
      type: 'string'
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Maximum number of logs to return',
      required: false,
      type: 'integer'
    }
  */
  getAllHabitLogs(req, res);
});

/**
 * @swagger
 * /habit-logs/{id}:
 *   get:
 *     summary: Get a habit log by ID
 *     tags: [Habit Logs]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: string
 *         description: User ID (temporary for testing)
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The habit log ID
 *     responses:
 *       200:
 *         description: Habit log details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/HabitLog'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Habit log not found
 */
router.get("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Habit Logs']
    #swagger.summary = 'Get a specific habit log by ID'
    #swagger.description = 'Retrieve details of a specific habit completion log by its ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Habit Log ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: true,
      type: 'string'
    }
  */
  getHabitLogById(req, res);
});

/**
 * @swagger
 * /habit-logs:
 *   post:
 *     summary: Log a habit completion
 *     tags: [Habit Logs]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: string
 *         description: User ID (temporary for testing)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - habitId
 *             properties:
 *               habitId:
 *                 type: string
 *                 description: ID of the habit being logged
 *               completedDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date of completion (defaults to now)
 *               completionCount:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 default: 1
 *                 description: Number of completions
 *               notes:
 *                 type: string
 *                 description: Optional notes
 *               mood:
 *                 type: string
 *                 enum: [excellent, good, okay, difficult, struggling]
 *                 description: User's mood
 *               difficulty:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Difficulty rating
 *     responses:
 *       201:
 *         description: Habit completion logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/HabitLog'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error or habit already logged for date
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Habit not found
 */
router.post("/", (req, res) => {
  /*  
    #swagger.tags = ['Habit Logs']
    #swagger.summary = 'Log a habit completion'
    #swagger.description = 'Record a completion of a habit for the current user.'
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Habit completion information',
      required: true,
      schema: {
        habitId: '671b123456789abcdef12345',
        userId: '671b123456789abcdef67890',
        completedDate: '2024-10-15T08:00:00.000Z',
        completionCount: 1,
        notes: 'Completed morning workout',
        mood: 'good',
        difficulty: 3
      }
    }
  */
  createHabitLog(req, res);
});

/**
 * @swagger
 * /habit-logs/{id}:
 *   put:
 *     summary: Update a habit log
 *     tags: [Habit Logs]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: string
 *         description: User ID (temporary for testing)
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The habit log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completionCount:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *               notes:
 *                 type: string
 *               mood:
 *                 type: string
 *                 enum: [excellent, good, okay, difficult, struggling]
 *               difficulty:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Habit log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/HabitLog'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error or no valid updates
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Habit log not found
 */
router.put("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Habit Logs']
    #swagger.summary = 'Update a habit log'
    #swagger.description = 'Update details of an existing habit completion log.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Habit Log ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated habit log information',
      required: true,
      schema: {
        completionCount: 2,
        notes: 'Updated notes - did extra reps today!',
        mood: 'excellent',
        difficulty: 2
      }
    }
  */
  updateHabitLog(req, res);
});

/**
 * @swagger
 * /habit-logs/{id}:
 *   delete:
 *     summary: Delete a habit log
 *     tags: [Habit Logs]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: string
 *         description: User ID (temporary for testing)
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The habit log ID
 *     responses:
 *       200:
 *         description: Habit log deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Habit log not found
 */
router.delete("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Habit Logs']
    #swagger.summary = 'Delete a habit log'
    #swagger.description = 'Delete a specific habit completion log by its ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Habit Log ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: true,
      type: 'string'
    }
  */
  deleteHabitLog(req, res);
});

/**
 * @swagger
 * /habit-logs/stats/{habitId}:
 *   get:
 *     summary: Get statistics for a specific habit
 *     tags: [Habit Logs]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: string
 *         description: User ID (temporary for testing)
 *       - in: path
 *         name: habitId
 *         schema:
 *           type: string
 *         required: true
 *         description: The habit ID
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to analyze
 *     responses:
 *       200:
 *         description: Habit statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     habit:
 *                       type: object
 *                     period:
 *                       type: string
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalCompletions:
 *                           type: integer
 *                         totalDays:
 *                           type: integer
 *                         completionRate:
 *                           type: string
 *                         currentStreak:
 *                           type: integer
 *                         longestStreak:
 *                           type: integer
 *                         averageMood:
 *                           type: number
 *                         averageDifficulty:
 *                           type: number
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Habit not found
 */
router.get("/stats/:habitId", (req, res) => {
  /*  
    #swagger.tags = ['Habit Logs']
    #swagger.summary = 'Get statistics for a specific habit'
    #swagger.description = 'Retrieve comprehensive statistics and analytics for a specific habit including completion rates, streaks, and performance metrics.'
    #swagger.parameters['habitId'] = {
      in: 'path',
      description: 'Habit ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['x-user-id'] = {
      in: 'header',
      description: 'User ID for authentication',
      required: true,
      type: 'string'
    }
    #swagger.parameters['days'] = {
      in: 'query',
      description: 'Number of days to analyze',
      required: false,
      type: 'integer'
    }
  */
  getHabitStats(req, res);
});

module.exports = router;
