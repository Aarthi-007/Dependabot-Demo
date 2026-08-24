const taskService = require('../services/taskService');

/**
 * Controller endpoint to retrieve all tasks
 */
function getTasks(req, res) {
  const tasks = taskService.getAllTasks(req.query);
  res.status(200).json(tasks);
}

/**
 * Controller endpoint to retrieve a single task by ID
 */
function getTaskById(req, res) {
  const task = taskService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json(task);
}

/**
 * Controller endpoint to create a new task
 */
function createTask(req, res) {
  try {
    const newTask = taskService.createTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Controller endpoint to update an existing task
 */
function updateTask(req, res) {
  try {
    const updatedTask = taskService.updateTask(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Controller endpoint to delete a task
 */
function deleteTask(req, res) {
  const success = taskService.deleteTask(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json({ message: 'Task deleted successfully' });
}

/**
 * Controller endpoint for health check
 */
function getHealth(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'Task Management API is healthy',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getHealth
};
