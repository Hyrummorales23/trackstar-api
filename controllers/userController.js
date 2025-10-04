const User = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching users: " + error.message,
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching user: " + error.message,
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    console.log("Creating user with data:", req.body);
    
    // Basic validation
    if (!req.body.oauthId || !req.body.provider || !req.body.name || !req.body.email) {
      return res.status(400).json({
        success: false,
        error: "oauthId, provider, name, and email are required"
      });
    }

    const user = new User(req.body);
    const savedUser = await user.save();
    
    console.log("User created successfully:", savedUser._id);
    res.status(201).json({
      success: true,
      data: savedUser
    });
  } catch (error) {
    console.log("Error creating user:", error.message);
    console.log("Error code:", error.code);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation error: " + error.message,
      });
    }
    if (error.code === 11000) { 
      console.log("Duplicate key error details:", error.keyValue);
      return res.status(400).json({
        success: false,
        error: "User with this oauthId or email already exists",
      });
    }
    res.status(500).json({
      success: false,
      error: "Error creating user: " + error.message,
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user
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
      error: "Error updating user: " + error.message,
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting user: " + error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};