const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "TrackStar API",
    description: "Personal Task & Habit Tracker API",
    version: "1.0.0",
    contact: {
      name: "TrackStar Team",
      email: "support@trackstar.com",
    },
  },
  host: process.env.RENDER_URL || "localhost:3000",
  schemes: ["https", "http"],
  tags: [
    {
      name: "Server",
      description: "Server status and general information endpoints",
    },
    {
      name: "Tasks",
      description:
        "Task management operations - Create, read, update and delete personal tasks",
    },
    {
      name: "Habits",
      description:
        "Habit management operations - Manage personal habits and tracking",
    },
    {
      name: "Users",
      description:
        "User management operations - Profile and account management",
    },
    {
      name: "Habit Logs",
      description:
        "Habit logging and tracking operations - Record and analyze habit completions",
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-user-id",
        description: "User ID for authentication (temporary for testing)",
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

//this wull generate swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc);
