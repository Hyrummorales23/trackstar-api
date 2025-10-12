const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task");
const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/trackstar")
  .then(() => console.log("Connected to MongoDB for seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Sample Users Data
const usersData = [
  {
    oauthId: "github_user001",
    provider: "github",
    name: "John Smith",
    email: "john.smith@example.com",
    username: "johnsmith",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    timezone: "America/New_York",
  },
  {
    oauthId: "github_user002",
    provider: "github",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    username: "mariagarcia",
    avatar: "https://avatars.githubusercontent.com/u/2?v=4",
    timezone: "America/Los_Angeles",
  },
  {
    oauthId: "google_user003",
    provider: "google",
    name: "David Chen",
    email: "david.chen@gmail.com",
    username: "davidchen",
    avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    timezone: "Asia/Shanghai",
  },
  {
    oauthId: "github_user004",
    provider: "github",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    username: "sarahjohnson",
    avatar: "https://avatars.githubusercontent.com/u/4?v=4",
    timezone: "Europe/London",
  },
  {
    oauthId: "google_user005",
    provider: "google",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@gmail.com",
    username: "alexrodriguez",
    avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    timezone: "America/Mexico_City",
  },
  {
    oauthId: "github_user006",
    provider: "github",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    username: "emmawilson",
    avatar: "https://avatars.githubusercontent.com/u/6?v=4",
    timezone: "Australia/Sydney",
  },
  {
    oauthId: "google_user007",
    provider: "google",
    name: "Michael Brown",
    email: "michael.brown@gmail.com",
    username: "michaelbrown",
    avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    timezone: "America/Chicago",
  },
];

// Sample Tasks Data (will be populated with user IDs after users are created)
const getTasksData = (userIds) => [
  {
    userId: userIds[0],
    title: "Complete API Documentation",
    description: "Write comprehensive documentation for the TrackStar API",
    dueDate: new Date("2024-12-31"),
    priority: "high",
    category: "work",
    isCompleted: false,
  },
  {
    userId: userIds[1],
    title: "Buy groceries",
    description: "Milk, eggs, bread, fruits, and vegetables",
    dueDate: new Date("2024-10-15"),
    priority: "medium",
    category: "personal",
    isCompleted: true,
  },
  {
    userId: userIds[2],
    title: "Prepare presentation",
    description: "Create slides for quarterly team meeting",
    dueDate: new Date("2024-10-20"),
    priority: "high",
    category: "work",
    isCompleted: false,
  },
  {
    userId: userIds[0],
    title: "Schedule dentist appointment",
    description: "Regular checkup and cleaning",
    dueDate: new Date("2024-11-05"),
    priority: "medium",
    category: "health",
    isCompleted: false,
  },
  {
    userId: userIds[3],
    title: "Read JavaScript book",
    description: 'Finish reading "You Don\'t Know JS" series',
    dueDate: new Date("2024-11-30"),
    priority: "low",
    category: "learning",
    isCompleted: false,
  },
  {
    userId: userIds[4],
    title: "Plan vacation",
    description: "Research destinations and book flights for summer vacation",
    dueDate: new Date("2024-12-15"),
    priority: "medium",
    category: "personal",
    isCompleted: false,
  },
  {
    userId: userIds[5],
    title: "Update resume",
    description: "Add recent projects and skills to resume",
    dueDate: new Date("2024-10-25"),
    priority: "medium",
    category: "career",
    isCompleted: true,
  },
  {
    userId: userIds[6],
    title: "Clean garage",
    description: "Organize tools and donate unused items",
    dueDate: new Date("2024-10-30"),
    priority: "low",
    category: "home",
    isCompleted: false,
  },
];

// Sample Habits Data
const getHabitsData = (userIds) => [
  {
    userId: userIds[0],
    name: "Morning Exercise",
    description: "30 minutes of cardio or strength training",
    frequency: "daily",
    targetCount: 1,
    category: "health",
    isActive: true,
  },
  {
    userId: userIds[1],
    name: "Read Books",
    description: "Read for at least 20 minutes",
    frequency: "daily",
    targetCount: 1,
    category: "learning",
    isActive: true,
  },
  {
    userId: userIds[2],
    name: "Meditation",
    description: "10 minutes of mindfulness meditation",
    frequency: "daily",
    targetCount: 1,
    category: "wellness",
    isActive: true,
  },
  {
    userId: userIds[0],
    name: "Drink Water",
    description: "Drink 8 glasses of water",
    frequency: "daily",
    targetCount: 8,
    category: "health",
    isActive: true,
  },
  {
    userId: userIds[3],
    name: "Learn Spanish",
    description: "Practice Spanish for 15 minutes",
    frequency: "daily",
    targetCount: 1,
    category: "learning",
    isActive: true,
  },
  {
    userId: userIds[4],
    name: "Weekly Planning",
    description: "Plan and organize the upcoming week",
    frequency: "weekly",
    targetCount: 1,
    category: "productivity",
    isActive: true,
  },
  {
    userId: userIds[5],
    name: "Yoga Practice",
    description: "20 minutes of yoga or stretching",
    frequency: "daily",
    targetCount: 1,
    category: "health",
    isActive: true,
  },
  {
    userId: userIds[6],
    name: "Journal Writing",
    description: "Write thoughts and reflections",
    frequency: "daily",
    targetCount: 1,
    category: "wellness",
    isActive: true,
  },
];

// Sample Habit Logs Data
const getHabitLogsData = (userIds, habitIds) => [
  {
    habitId: habitIds[0],
    userId: userIds[0],
    completedDate: new Date("2024-10-10T07:00:00.000Z"),
    completionCount: 1,
    notes: "Great morning run, felt energized",
    mood: "excellent",
    difficulty: 2,
  },
  {
    habitId: habitIds[1],
    userId: userIds[1],
    completedDate: new Date("2024-10-10T20:00:00.000Z"),
    completionCount: 1,
    notes: "Read chapter 3 of productivity book",
    mood: "good",
    difficulty: 1,
  },
  {
    habitId: habitIds[2],
    userId: userIds[2],
    completedDate: new Date("2024-10-10T08:00:00.000Z"),
    completionCount: 1,
    notes: "Peaceful meditation session",
    mood: "excellent",
    difficulty: 3,
  },
  {
    habitId: habitIds[0],
    userId: userIds[0],
    completedDate: new Date("2024-10-11T07:30:00.000Z"),
    completionCount: 1,
    notes: "Weight training session, increased reps",
    mood: "good",
    difficulty: 4,
  },
  {
    habitId: habitIds[3],
    userId: userIds[0],
    completedDate: new Date("2024-10-11T12:00:00.000Z"),
    completionCount: 6,
    notes: "Drank 6 glasses today, need to improve",
    mood: "okay",
    difficulty: 2,
  },
  {
    habitId: habitIds[4],
    userId: userIds[3],
    completedDate: new Date("2024-10-11T19:00:00.000Z"),
    completionCount: 1,
    notes: "Practiced conjugations, making progress",
    mood: "good",
    difficulty: 3,
  },
  {
    habitId: habitIds[6],
    userId: userIds[5],
    completedDate: new Date("2024-10-11T06:30:00.000Z"),
    completionCount: 1,
    notes: "Morning yoga, great way to start the day",
    mood: "excellent",
    difficulty: 2,
  },
  {
    habitId: habitIds[7],
    userId: userIds[6],
    completedDate: new Date("2024-10-11T22:00:00.000Z"),
    completionCount: 1,
    notes: "Reflected on the day, grateful for progress",
    mood: "good",
    difficulty: 1,
  },
  {
    habitId: habitIds[1],
    userId: userIds[1],
    completedDate: new Date("2024-10-11T19:30:00.000Z"),
    completionCount: 1,
    notes: "Finished another chapter, very interesting",
    mood: "excellent",
    difficulty: 1,
  },
  {
    habitId: habitIds[2],
    userId: userIds[2],
    completedDate: new Date("2024-10-11T08:15:00.000Z"),
    completionCount: 1,
    notes: "Struggled to focus today",
    mood: "difficult",
    difficulty: 4,
  },
];

async function seedDatabase() {
  try {
    console.log("🗑️ Clearing existing data...");

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await Habit.deleteMany({});
    await HabitLog.deleteMany({});

    console.log("👥 Creating users...");
    const users = await User.insertMany(usersData);
    const userIds = users.map((user) => user._id);
    console.log(`✅ Created ${users.length} users`);

    console.log("📋 Creating tasks...");
    const tasks = await Task.insertMany(getTasksData(userIds));
    console.log(`✅ Created ${tasks.length} tasks`);

    console.log("🎯 Creating habits...");
    const habits = await Habit.insertMany(getHabitsData(userIds));
    const habitIds = habits.map((habit) => habit._id);
    console.log(`✅ Created ${habits.length} habits`);

    console.log("📊 Creating habit logs...");
    const habitLogs = await HabitLog.insertMany(
      getHabitLogsData(userIds, habitIds)
    );
    console.log(`✅ Created ${habitLogs.length} habit logs`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Users: ${users.length}`);
    console.log(`- Tasks: ${tasks.length}`);
    console.log(`- Habits: ${habits.length}`);
    console.log(`- Habit Logs: ${habitLogs.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
