const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger-output.json");
const router = express.Router();

// Import individual route modules
const taskRoutes = require("./tasks");
const habitRoutes = require("./habits");
const userRoutes = require("./users");
const habitLogRoutes = require("./habitLogs");
const authRoutes = require("./authRoutes");

// Swagger Documentation Route
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route - Server status
router.get("/", (req, res) => {
  /*  
    #swagger.tags = ['Server']
    #swagger.summary = 'Get server status and information'
    #swagger.description = 'Returns general information about the TrackStar API server including version, status, and available endpoints.'
  */
  res.json({
    message: "TrackStar API is running!",
    documentation: "/api-docs",
    api: "/api",
    version: "1.0.0",
    status: "operational",
    timestamp: new Date().toISOString(),
  });
});

// API Routes under /api
const apiRouter = express.Router();

// API sub-routes
apiRouter.use("/tasks", taskRoutes);
apiRouter.use("/habits", habitRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/habit-logs", habitLogRoutes);

// Mount API routes
router.use("/api", apiRouter);

// Add auth routes at root level
router.use("/auth", authRoutes);

// Debug routes for session testing
router.get('/debug/session', (req, res) => {
    res.json({
        sessionId: req.sessionID,
        authenticated: req.isAuthenticated(),
        user: req.user || null,
        session: req.session,
        headers: {
            host: req.headers.host,
            'user-agent': req.headers['user-agent'],
            cookie: req.headers.cookie ? 'present' : 'missing'
        }
    });
});

router.get('/debug/set-test-session', (req, res) => {
    req.session.testValue = 'This is a test session value';
    req.session.testTime = new Date().toISOString();
    res.json({
        success: true,
        message: 'Test session value set',
        sessionId: req.sessionID
    });
});

router.get('/debug/get-test-session', (req, res) => {
    res.json({
        success: true,
        testValue: req.session.testValue,
        testTime: req.session.testTime,
        sessionId: req.sessionID
    });
});

module.exports = router;
