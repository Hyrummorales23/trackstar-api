const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  name: {
    type: String,
    required: [true, "Habit name is required"],
    trim: true,
    maxlength: [100, "Habit name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "daily",
  },
  targetCount: {
    type: Number,
    default: 1,
    min: [1, "Target count must be at least 1"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    default: "health",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
habitSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Habit", habitSchema);
