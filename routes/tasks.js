import express from 'express';
import bodyParser from 'body-parser';
import taskRoutes from '../controllers/task.controller.js';

const app = express();
app.use(bodyParser.json());

app.get('/tasks/:userId', taskRoutes.getTasks);
app.post('/tasks', taskRoutes.createTask);
app.get('/tasks/:userId', taskRoutes.getTasks);
app.put('/tasks/:taskId', taskRoutes.updateTask);
