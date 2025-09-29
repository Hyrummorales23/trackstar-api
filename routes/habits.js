const express = require('express');
const router = express.Router();
const {
  getAllHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit
} = require('../controllers/habitController');

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
router.get('/', getAllHabits);

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
router.get('/:id', getHabitById);

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
router.post('/', createHabit);

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
router.put('/:id', updateHabit);

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
router.delete('/:id', deleteHabit);

module.exports = router;