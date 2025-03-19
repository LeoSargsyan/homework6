import {Router} from 'express';

import controller from '../controllers/users.controller.js';
import schemas from '../schemas/users.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';

const router = Router();

// renders
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

// apis
router.get('/profile', auth, controller.profile);
router.post('/login', controller.login);
router.post('/register', validate(schemas.register, "body"), controller.register);

export default router;
