const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - oauthId
 *         - provider
 *         - name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         oauthId:
 *           type: string
 *           description: The OAuth provider's user ID
 *         provider:
 *           type: string
 *           enum: [github, google]
 *           description: The OAuth provider
 *         name:
 *           type: string
 *           description: The user's full name
 *         email:
 *           type: string
 *           description: The user's email address
 *         username:
 *           type: string
 *           description: The user's username
 *         avatar:
 *           type: string
 *           description: URL to the user's avatar image
 *         timezone:
 *           type: string
 *           description: The user's timezone
 *         isActive:
 *           type: boolean
 *           description: Whether the user account is active
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
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
 *                     $ref: '#/components/schemas/User'
 */
router.get("/", (req, res) => {
  /*  
    #swagger.tags = ['Users']
    #swagger.summary = 'Get all users'
    #swagger.description = 'Retrieve all users in the system.'
  */
  getAllUsers(req, res);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Users']
    #swagger.summary = 'Get a specific user by ID'
    #swagger.description = 'Retrieve details of a specific user by their ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'string'
    }
  */
  getUserById(req, res);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oauthId
 *               - provider
 *               - name
 *               - email
 *             properties:
 *               oauthId:
 *                 type: string
 *               provider:
 *                 type: string
 *                 enum: [github, google]
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *               timezone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or duplicate user
 */
router.post("/", (req, res) => {
  /*  
    #swagger.tags = ['Users']
    #swagger.summary = 'Create a new user'
    #swagger.description = 'Create a new user account in the system.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User information',
      required: true,
      schema: {
        oauthId: 'github_123456789',
        provider: 'github',
        name: 'John Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        avatar: 'https://example.com/avatar.jpg',
        timezone: 'UTC-5'
      }
    }
  */
  createUser(req, res);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *               timezone:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error
 */
router.put("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Users']
    #swagger.summary = 'Update an existing user'
    #swagger.description = 'Update details of an existing user by their ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated user information',
      required: true,
      schema: {
        name: 'Updated Name',
        email: 'updated@example.com',
        username: 'updatedusername',
        timezone: 'UTC-8',
        isActive: true
      }
    }
  */
  updateUser(req, res);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", (req, res) => {
  /*  
    #swagger.tags = ['Users']
    #swagger.summary = 'Delete a user'
    #swagger.description = 'Delete a specific user by their ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'string'
    }
  */
  deleteUser(req, res);
});

module.exports = router;