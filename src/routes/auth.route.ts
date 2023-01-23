import { Router } from 'express';
import { login, registerUser } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/register', registerUser);

export default router;