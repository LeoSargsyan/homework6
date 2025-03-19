import express from 'express';
import taskRoutes from '../controllers/task.controller.js';

const router = express.Router();

router.post('/', taskRoutes.createTask);
router.get('/:userId', taskRoutes.getTasks);
router.put('/:taskId', taskRoutes.updateTask);

export default router;
