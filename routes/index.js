import { Router } from 'express';

import users from './users.js';
import tasks from './tasks.js';

const router = Router();

router.get(['/', '/home?'], (req, res) => {
  res.render('home', { title: 'Auth test project' });
});

router.use('/users', users)
router.use('/tasks', tasks);

export default router;
