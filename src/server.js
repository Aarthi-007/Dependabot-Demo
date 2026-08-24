const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(` Task Management API Server Running`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/health`);
  console.log(` Tasks: http://localhost:${PORT}/api/tasks`);
  console.log(`===========================================`);
});
