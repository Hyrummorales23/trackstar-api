const mongoose = require("mongoose");

const habitLogSchema = new mongoose.Schema({
  // References to other collections
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: [true, "Habit ID is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },

  // Completion details
  completedDate: {
    type: Date,
    required: [true, "Completion date is required"],
    default: Date.now,
  },
  completionCount: {
    type: Number,
    default: 1,
    min: [1, "Completion count must be at least 1"],
    max: [100, "Completion count cannot exceed 100"],
  },

  // Optional fields
  notes: {
    type: String,
    maxlength: [500, "Notes cannot exceed 500 characters"],
    trim: true,
  },
  mood: {
    type: String,
    enum: ["excellent", "good", "okay", "difficult", "struggling"],
    default: "okay",
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },

  // Tracking fields
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate logs for same habit on same date by same user
habitLogSchema.index(
  {
    habitId: 1,
    userId: 1,
    completedDate: 1,
  },
  {
    unique: true,
    name: "unique_habit_user_date",
  },
);

// Index for querying user's habit logs
habitLogSchema.index({ userId: 1, completedDate: -1 });

// Index for querying specific habit logs
habitLogSchema.index({ habitId: 1, completedDate: -1 });

// Update the updatedAt field before saving
habitLogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual to get just the date part (without time) for easier querying
habitLogSchema.virtual("dateOnly").get(function () {
  return this.completedDate.toISOString().split("T")[0];
});

// Virtual to populate habit and user info when needed
habitLogSchema.virtual("habitInfo", {
  ref: "Habit",
  localField: "habitId",
  foreignField: "_id",
  justOne: true,
});

habitLogSchema.virtual("userInfo", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Ensure virtual fields are serialized
habitLogSchema.set("toJSON", { virtuals: true });

// Static method to get logs for a specific habit
habitLogSchema.statics.getHabitLogs = function (habitId, userId, limit = 30) {
  return this.find({ habitId, userId })
    .sort({ completedDate: -1 })
    .limit(limit);
};

// Static method to get user's logs for a date range
habitLogSchema.statics.getUserLogsInRange = function (
  userId,
  startDate,
  endDate,
) {
  return this.find({
    userId,
    completedDate: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ completedDate: -1 });
};

module.exports = mongoose.model("HabitLog", habitLogSchema, "habitlogs");
