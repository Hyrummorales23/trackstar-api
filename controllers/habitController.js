const Habit = require('../models/Habit');

// Get all habits
const getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: habits.length,
      data: habits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching habits: ' + error.message
    });
  }
};

// Get single habit by ID
const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        error: 'Habit not found'
      });
    }
    
    res.json({
      success: true,
      data: habit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching habit: ' + error.message
    });
  }
};

// Create new habit
const createHabit = async (req, res) => {
  try {
    // Basic validation
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        error: 'Habit name is required'
      });
    }

    const habit = new Habit(req.body);
    const savedHabit = await habit.save();
    
    res.status(201).json({
      success: true,
      data: savedHabit
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error: ' + error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Error creating habit: ' + error.message
    });
  }
};

// Update habit
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        error: 'Habit not found'
      });
    }
    
    res.json({
      success: true,
      data: habit
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error: ' + error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Error updating habit: ' + error.message
    });
  }
};

// Delete habit
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        error: 'Habit not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Habit deleted successfully',
      data: habit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error deleting habit: ' + error.message
    });
  }
};

module.exports = {
  getAllHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit
};