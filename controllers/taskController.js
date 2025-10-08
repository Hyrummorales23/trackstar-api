const Task = require('../models/Task');

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching tasks: ' + error.message
    });
  }
};

// Get single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching task: ' + error.message
    });
  }
};

// Create new task
const createTask = async (req, res) => {
    try {
        // Basic validation
        if (!req.body.title) {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        // Add user ID from authenticated session
        const taskData = {
            ...req.body,
            userId: req.user._id // Add authenticated user ID
        };

        const task = new Task(taskData);
        const savedTask = await task.save();

        res.status(201).json({
            success: true,
            data: savedTask
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
            error: 'Error creating task: ' + error.message
        });
    }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task
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
      error: 'Error updating task: ' + error.message
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error deleting task: ' + error.message
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};