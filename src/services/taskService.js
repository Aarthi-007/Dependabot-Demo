const _ = require('lodash');

// Initial seed data for demonstration
const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Review Dependabot Alerts',
    description: 'Check repository security tab for automated dependency vulnerability reports.',
    completed: false,
    createdAt: '2026-08-24T08:00:00.000Z'
  },
  {
    id: '2',
    title: 'Configure GitHub Actions CI',
    description: 'Ensure automated test suite runs on all pull requests and pushes to main branch.',
    completed: true,
    createdAt: '2026-08-24T09:00:00.000Z'
  }
];

let tasks = _.cloneDeep(INITIAL_TASKS);
let idCounter = 3;

/**
 * Resets tasks to initial state (useful for test suite isolation)
 */
function resetTasks() {
  tasks = _.cloneDeep(INITIAL_TASKS);
  idCounter = 3;
}

/**
 * Retrieves all tasks, with optional filtering and sorting via Lodash
 */
function getAllTasks(query = {}) {
  let result = tasks;

  // Filter by completion status if provided
  if (!_.isNil(query.completed)) {
    const isCompleted = query.completed === 'true' || query.completed === true;
    result = _.filter(result, { completed: isCompleted });
  }

  // Sort by field using Lodash orderBy
  const sortBy = _.isString(query.sortBy) && !_.isEmpty(query.sortBy) ? query.sortBy : 'createdAt';
  const order = query.order === 'asc' ? 'asc' : 'desc';
  result = _.orderBy(result, [sortBy], [order]);

  // Return deep copies to prevent external state mutation
  return _.cloneDeep(result);
}

/**
 * Retrieves a single task by ID
 */
function getTaskById(id) {
  const task = _.find(tasks, { id: String(id) });
  return task ? _.cloneDeep(task) : null;
}

/**
 * Creates a new task after sanitizing input with Lodash
 */
function createTask(taskData) {
  // Sanitize input properties using Lodash pick
  const sanitized = _.pick(taskData, ['title', 'description']);

  // Validate title
  if (!_.isString(sanitized.title) || _.isEmpty(_.trim(sanitized.title))) {
    const error = new Error('Task title is required and cannot be empty.');
    error.statusCode = 400;
    throw error;
  }

  const newTask = {
    id: String(idCounter++),
    title: _.trim(sanitized.title),
    description: _.isString(sanitized.description) ? _.trim(sanitized.description) : '',
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  return _.cloneDeep(newTask);
}

/**
 * Updates an existing task by ID using Lodash
 */
function updateTask(id, updateData) {
  const task = _.find(tasks, { id: String(id) });

  if (!task) {
    return null;
  }

  // Whitelist update fields using Lodash pick
  const sanitized = _.pick(updateData, ['title', 'description', 'completed']);

  // Validation checks
  if (!_.isUndefined(sanitized.title)) {
    if (!_.isString(sanitized.title) || _.isEmpty(_.trim(sanitized.title))) {
      const error = new Error('Task title cannot be empty.');
      error.statusCode = 400;
      throw error;
    }
    task.title = _.trim(sanitized.title);
  }

  if (!_.isUndefined(sanitized.description)) {
    if (!_.isString(sanitized.description)) {
      const error = new Error('Task description must be a string.');
      error.statusCode = 400;
      throw error;
    }
    task.description = _.trim(sanitized.description);
  }

  if (!_.isUndefined(sanitized.completed)) {
    if (!_.isBoolean(sanitized.completed)) {
      const error = new Error('Completed status must be a boolean value (true or false).');
      error.statusCode = 400;
      throw error;
    }
    task.completed = sanitized.completed;
  }

  return _.cloneDeep(task);
}

/**
 * Deletes a task by ID
 */
function deleteTask(id) {
  const index = _.findIndex(tasks, { id: String(id) });

  if (index === -1) {
    return false;
  }

  _.pullAt(tasks, index);
  return true;
}

module.exports = {
  resetTasks,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
