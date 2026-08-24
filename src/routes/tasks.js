const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /api/tasks - Retrieve all tasks
router.get('/', taskController.getTasks);

// POST /api/tasks - Create a new task
router.post('/', taskController.createTask);

// GET /api/tasks/:id - Retrieve a single task by ID
router.get('/:id', taskController.getTaskById);

// PATCH /api/tasks/:id - Update a task by ID
router.patch('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/:id', taskController.deleteTask);

module.exports = router;
