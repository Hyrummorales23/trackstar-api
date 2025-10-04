const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // OAuth fields from provider (like GitHub)
  oauthId: {
    type: String,
    required: [true, "OauthId is required"],
    unique: true,
  },
  provider: {
    type: String,
    required: [true, "Provider is required"],
    enum: ["github", "google"], // Can expand as needed
    default: "github",
  },

  // User profile information
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  username: {
    type: String,
    trim: true,
    maxlength: [50, "Username cannot exceed 50 characters"],
  },
  avatar: {
    type: String, // URL to profile picture
    default: null,
  },

  // User preferences
  timezone: {
    type: String,
    default: "UTC",
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  // Tracking fields
  lastLogin: {
    type: Date,
    default: Date.now,
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
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for user's full profile
userSchema.virtual("profile").get(function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    username: this.username,
    avatar: this.avatar,
    timezone: this.timezone,
  };
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);