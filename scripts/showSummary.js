const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task");
const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/trackstar")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function showDatabaseSummary() {
  try {
    console.log("📊 TRACKSTAR DATABASE SUMMARY");
    console.log("================================\n");

    // Get counts
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();
    const habitCount = await Habit.countDocuments();
    const habitLogCount = await HabitLog.countDocuments();

    console.log(`👥 USERS: ${userCount}`);
    const users = await User.find().select("name email provider").limit(5);
    users.forEach((user, index) => {
      console.log(
        `   ${index + 1}. ${user.name} (${user.email}) - ${user.provider}`
      );
    });
    if (userCount > 5) console.log(`   ... and ${userCount - 5} more users`);

    console.log(`\n📋 TASKS: ${taskCount}`);
    const tasks = await Task.find()
      .populate("userId", "name")
      .select("title priority category isCompleted")
      .limit(5);
    tasks.forEach((task, index) => {
      const status = task.isCompleted ? "✅" : "⏳";
      console.log(
        `   ${index + 1}. ${status} ${task.title} (${task.priority}) - ${
          task.userId?.name || "Unknown"
        }`
      );
    });
    if (taskCount > 5) console.log(`   ... and ${taskCount - 5} more tasks`);

    console.log(`\n🎯 HABITS: ${habitCount}`);
    const habits = await Habit.find()
      .populate("userId", "name")
      .select("name frequency category")
      .limit(5);
    habits.forEach((habit, index) => {
      console.log(
        `   ${index + 1}. ${habit.name} (${habit.frequency}) - ${
          habit.userId?.name || "Unknown"
        }`
      );
    });
    if (habitCount > 5) console.log(`   ... and ${habitCount - 5} more habits`);

    console.log(`\n📊 HABIT LOGS: ${habitLogCount}`);
    const habitLogs = await HabitLog.find()
      .populate("habitId", "name")
      .populate("userId", "name")
      .select("completedDate mood completionCount")
      .sort({ completedDate: -1 })
      .limit(5);

    habitLogs.forEach((log, index) => {
      const date = log.completedDate.toLocaleDateString();
      const moodEmoji = {
        excellent: "😄",
        good: "😊",
        okay: "😐",
        difficult: "😕",
        struggling: "😫",
      };
      console.log(
        `   ${index + 1}. ${log.habitId?.name || "Unknown Habit"} - ${date} ${
          moodEmoji[log.mood] || "😐"
        } (${log.userId?.name || "Unknown"})`
      );
    });
    if (habitLogCount > 5)
      console.log(`   ... and ${habitLogCount - 5} more logs`);

    console.log("\n🚀 API ENDPOINTS TO TEST:");
    console.log("   GET /api/users");
    console.log("   GET /api/tasks");
    console.log("   GET /api/habits");
    console.log("   GET /api/habit-logs");
    console.log("\n📖 Documentation: /api-docs");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error retrieving database summary:", error);
    process.exit(1);
  }
}

// Run the summary function
showDatabaseSummary();
