const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
require("dotenv").config();

// Import passport configuration
require('./config/oauth');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
app.use(cors({
    origin: process.env.RENDER_URL || "http://localhost:3000",
    credentials: true
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'trackstar-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Regular middleware
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trackstar')
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Import and use all routes
const routes = require("./routes/index");
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}/ for API information`);
});