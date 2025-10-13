const HabitLog = require("../models/HabitLog");
const Habit = require("../models/Habit");
const mongoose = require("mongoose"); // Fixed ObjectId conversion issue - v2

// Get all habit logs for current user
const getAllHabitLogs = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const { habitId, startDate, endDate, limit = 30 } = req.query;
    let query = { userId: new mongoose.Types.ObjectId(userId) };

    // Filter by habit if specified
    if (habitId) {
      query.habitId = new mongoose.Types.ObjectId(habitId);
    }

    // Filter by date range if specified
    if (startDate || endDate) {
      query.completedDate = {};
      if (startDate) query.completedDate.$gte = new Date(startDate);
      if (endDate) query.completedDate.$lte = new Date(endDate);
    }

    const habitLogs = await HabitLog.find(query)
      .populate("habitId", "name description category")
      .sort({ completedDate: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: habitLogs.length,
      data: habitLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching habit logs: " + error.message,
    });
  }
};

// Get single habit log by ID
const getHabitLogById = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const habitLog = await HabitLog.findOne({
      _id: req.params.id,
      userId,
    }).populate("habitId", "name description category");

    if (!habitLog) {
      return res.status(404).json({
        success: false,
        error: "Habit log not found",
      });
    }

    res.json({
      success: true,
      data: habitLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching habit log: " + error.message,
    });
  }
};

// Create new habit log (log a habit completion)
const createHabitLog = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const { habitId, completedDate, completionCount, notes, mood, difficulty } =
      req.body;

    // Validate required fields
    if (!habitId) {
      return res.status(400).json({
        success: false,
        error: "Habit ID is required",
      });
    }

    // Verify habit exists and belongs to user
    const habit = await Habit.findOne({
      _id: new mongoose.Types.ObjectId(habitId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!habit) {
      return res.status(404).json({
        success: false,
        error: "Habit not found or does not belong to user",
      });
    }

    // Create habit log
    const habitLog = new HabitLog({
      habitId,
      userId,
      completedDate: completedDate || new Date(),
      completionCount: completionCount || 1,
      notes,
      mood,
      difficulty,
    });

    await habitLog.save();

    // Populate habit info for response
    await habitLog.populate("habitId", "name description category");

    res.status(201).json({
      success: true,
      data: habitLog,
      message: "Habit completion logged successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Habit already logged for this date",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation error: " + error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Error creating habit log: " + error.message,
    });
  }
};

// Update habit log
const updateHabitLog = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const allowedUpdates = ["completionCount", "notes", "mood", "difficulty"];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid updates provided",
      });
    }

    const habitLog = await HabitLog.findOneAndUpdate(
      { _id: req.params.id, userId },
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("habitId", "name description category");

    if (!habitLog) {
      return res.status(404).json({
        success: false,
        error: "Habit log not found",
      });
    }

    res.json({
      success: true,
      data: habitLog,
      message: "Habit log updated successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation error: " + error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Error updating habit log: " + error.message,
    });
  }
};

// Delete habit log
const deleteHabitLog = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const habitLog = await HabitLog.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!habitLog) {
      return res.status(404).json({
        success: false,
        error: "Habit log not found",
      });
    }

    res.json({
      success: true,
      message: "Habit log deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting habit log: " + error.message,
    });
  }
};

// Get habit statistics (bonus feature)
const getHabitStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const { habitId } = req.params;
    const { days = 30 } = req.query;

    // Verify habit belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({
        success: false,
        error: "Habit not found or does not belong to user",
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const logs = await HabitLog.find({
      habitId,
      userId,
      completedDate: { $gte: startDate },
    }).sort({ completedDate: 1 });

    const stats = {
      totalCompletions: logs.length,
      totalDays: parseInt(days),
      completionRate: ((logs.length / parseInt(days)) * 100).toFixed(1),
      currentStreak: calculateCurrentStreak(logs),
      longestStreak: calculateLongestStreak(logs),
      averageMood: calculateAverageMood(logs),
      averageDifficulty: calculateAverageDifficulty(logs),
    };

    res.json({
      success: true,
      data: {
        habit: {
          id: habit._id,
          name: habit.name,
          description: habit.description,
        },
        period: `Last ${days} days`,
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error calculating habit stats: " + error.message,
    });
  }
};

// Helper functions for statistics
function calculateCurrentStreak(logs) {
  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = logs.length - 1; i >= 0; i--) {
    const logDate = new Date(logs[i].completedDate);
    logDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(logs) {
  if (logs.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < logs.length; i++) {
    const prevDate = new Date(logs[i - 1].completedDate);
    const currentDate = new Date(logs[i].completedDate);

    const daysDiff = Math.floor(
      (currentDate - prevDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function calculateAverageMood(logs) {
  if (logs.length === 0) return null;

  const moodValues = {
    struggling: 1,
    difficult: 2,
    okay: 3,
    good: 4,
    excellent: 5,
  };

  const logsWithMood = logs.filter((log) => log.mood);
  if (logsWithMood.length === 0) return null;

  const average =
    logsWithMood.reduce((sum, log) => sum + moodValues[log.mood], 0) /
    logsWithMood.length;
  return Math.round(average * 10) / 10;
}

function calculateAverageDifficulty(logs) {
  if (logs.length === 0) return null;

  const logsWithDifficulty = logs.filter((log) => log.difficulty);
  if (logsWithDifficulty.length === 0) return null;

  const average =
    logsWithDifficulty.reduce((sum, log) => sum + log.difficulty, 0) /
    logsWithDifficulty.length;
  return Math.round(average * 10) / 10;
}

module.exports = {
  getAllHabitLogs,
  getHabitLogById,
  createHabitLog,
  updateHabitLog,
  deleteHabitLog,
  getHabitStats,
};
