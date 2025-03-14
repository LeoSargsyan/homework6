import { Router } from 'express';

import users from './users.js';

const router = Router();

router.get(['/', '/home'], (req, res) => {
  res.render('home', { title: 'Auth test project' });
});

router.use('/users', users)

export default router;
