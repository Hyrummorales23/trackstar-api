const User = require("../models/User");

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    // Note: In a real app, req.user would be set by authentication middleware
    // For now, we'll expect userId to be passed in some way
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const user = await User.findById(userId).select("-providerId");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching user profile: " + error.message,
    });
  }
};

// Update current user profile
const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // Only allow updating certain fields
    const allowedUpdates = ["name", "username", "timezone"];
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

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-providerId");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.profile,
      message: "Profile updated successfully",
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
      error: "Error updating user profile: " + error.message,
    });
  }
};

// Delete current user account
const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Note: In a real app, you might want to:
    // 1. Soft delete related data (tasks, habits, habit logs)
    // 2. Invalidate all user sessions/tokens
    // 3. Send confirmation email

    res.json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting user account: " + error.message,
    });
  }
};

// Create new user (for OAuth callback)
const createUser = async (req, res) => {
  try {
    const { providerId, provider, name, email, username, avatar } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ providerId, provider });

    if (existingUser) {
      // Update last login and return existing user
      existingUser.lastLogin = new Date();
      await existingUser.save();

      return res.json({
        success: true,
        data: existingUser.profile,
        message: "User logged in successfully",
      });
    }

    // Create new user
    const newUser = new User({
      providerId,
      provider,
      name,
      email,
      username,
      avatar,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      data: newUser.profile,
      message: "User created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "User with this email or provider ID already exists",
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
      error: "Error creating user: " + error.message,
    });
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  createUser,
};
