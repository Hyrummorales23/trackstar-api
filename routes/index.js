const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger-output.json");
const router = express.Router();

// Import individual route modules
const taskRoutes = require("./tasks");
const habitRoutes = require("./habits");
const userRoutes = require("./users");
const habitLogRoutes = require("./habitLogs");

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

// Root API route - API information
apiRouter.get("/", (req, res) => {
  /*  
    #swagger.tags = ['Server']
    #swagger.summary = 'Get API information and available endpoints'
    #swagger.description = 'Returns detailed information about the TrackStar API including all available endpoints and their purposes.'
  */
  res.json({
    message: "TrackStar API - Personal Task & Habit Tracker",
    version: "1.0.0",
    endpoints: {
      documentation: "/api-docs",
      users: "/api/users",
      tasks: "/api/tasks",
      habits: "/api/habits",
      habitLogs: "/api/habit-logs",
    },
    status: "operational",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  /*  
    #swagger.tags = ['Server']
    #swagger.summary = 'Health check endpoint'
    #swagger.description = 'Returns server health status including uptime, memory usage, and Node.js version.'
  */
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
  });
});

// Mount API routes
router.use("/api", apiRouter);

module.exports = router;
