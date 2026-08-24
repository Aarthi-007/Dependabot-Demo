const express = require('express');
const tasksRouter = require('./routes/tasks');
const taskController = require('./controllers/taskController');

const app = express();

// Middleware for parsing JSON request bodies
app.use(express.json());

// GET /health - Health check endpoint
app.get('/health', taskController.getHealth);

// Mount task endpoints under /api/tasks
app.use('/api/tasks', tasksRouter);

// 404 Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
