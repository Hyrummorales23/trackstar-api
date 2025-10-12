const express = require("express");
const passport = require("passport");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user's display name
 *         email:
 *           type: string
 *           description: The user's email
 *         avatar:
 *           type: string
 *           description: The user's photo URL
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent screen
 */

// Only register Google OAuth routes if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  /**
   * @swagger
   * /auth/google/callback:
   *   get:
   *     summary: Google OAuth callback URL
   *     tags: [Authentication]
   *     responses:
   *       302:
   *         description: Redirects to home page after successful login
   *       401:
   *         description: Authentication failed
   */
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/auth/failure",
      successRedirect: "/api-docs",
    })
  );
} else {
  // Provide error routes when OAuth is not configured
  router.get("/google", (req, res) => {
    res.status(503).json({
      success: false,
      error: "Google OAuth is not configured. Please contact administrator.",
    });
  });

  router.get("/google/callback", (req, res) => {
    res.status(503).json({
      success: false,
      error: "Google OAuth is not configured. Please contact administrator.",
    });
  });
}

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns current user data if authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: User not authenticated
 */
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      error: "Not authenticated",
    });
  }
});

/**
 * @swagger
 * /auth/failure:
 *   get:
 *     summary: Login failed page
 *     tags: [Authentication]
 *     responses:
 *       401:
 *         description: Returns login failure message
 */
router.get("/failure", (req, res) => {
  res.status(401).json({
    success: false,
    error: "Google authentication failed",
  });
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: "Logout failed",
      });
    }
    res.json({
      success: true,
      message: "Logout successful",
    });
  });
});

// debug and test
router.get("/auth/debug-callback", (req, res) => {
  res.json({
    sessionId: req.sessionID,
    authenticated: req.isAuthenticated(),
    user: req.user || null,
    query: req.query,
    cookies: req.headers.cookie,
  });
});

module.exports = router;
