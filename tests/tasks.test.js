const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task Management REST API Test Suite', () => {
  beforeEach(() => {
    // Isolate tests by resetting in-memory task store before each test
    taskService.resetTasks();
  });

  describe('GET /health', () => {
    it('should return 200 OK and health metrics', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all initial seeded tasks', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      const titles = response.body.map(t => t.title);
      expect(titles).toContain('Review Dependabot Alerts');
      expect(titles).toContain('Configure GitHub Actions CI');
    });

    it('should support filtering tasks by completed status', async () => {
      const response = await request(app).get('/api/tasks?completed=true');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Configure GitHub Actions CI');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a specific task when given a valid ID', async () => {
      const response = await request(app).get('/api/tasks/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', '1');
      expect(response.body).toHaveProperty('title', 'Review Dependabot Alerts');
      expect(response.body).toHaveProperty('completed', false);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 404 Not Found when task ID does not exist', async () => {
      const response = await request(app).get('/api/tasks/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('POST /api/tasks', () => {
    it('should successfully create a new task with valid title and description', async () => {
      const payload = {
        title: 'Demonstrate Dependabot Workflow',
        description: 'Show how automated PRs and CI checks work during live demo.'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(payload.title);
      expect(response.body.description).toBe(payload.description);
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');

      // Verify task was appended to list
      const allTasksRes = await request(app).get('/api/tasks');
      expect(allTasksRes.body.length).toBe(3);
    });

    it('should return 400 Bad Request when title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'Task without a title' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/title is required/i);
    });

    it('should return 400 Bad Request when title is empty or whitespace', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should update task title, description, and completed status', async () => {
      const updatePayload = {
        title: 'Updated Task Title',
        description: 'New Description',
        completed: true
      };

      const response = await request(app)
        .patch('/api/tasks/1')
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.title).toBe('Updated Task Title');
      expect(response.body.description).toBe('New Description');
      expect(response.body.completed).toBe(true);
    });

    it('should return 404 Not Found when updating a non-existent task', async () => {
      const response = await request(app)
        .patch('/api/tasks/999')
        .send({ title: 'Non-existent Task' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Task not found' });
    });

    it('should return 400 Bad Request when completed status is not a boolean', async () => {
      const response = await request(app)
        .patch('/api/tasks/1')
        .send({ completed: 'yes' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/boolean value/i);
    });

    it('should return 400 Bad Request when updating title to an empty string', async () => {
      const response = await request(app)
        .patch('/api/tasks/1')
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task and return 200 OK', async () => {
      const response = await request(app).delete('/api/tasks/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Task deleted successfully' });

      // Verify task no longer exists
      const getRes = await request(app).get('/api/tasks/1');
      expect(getRes.status).toBe(404);
    });

    it('should return 404 Not Found when deleting a non-existent task', async () => {
      const response = await request(app).delete('/api/tasks/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('404 Route Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Route not found' });
    });
  });
});
