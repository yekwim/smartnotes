import { Router } from 'express';
import * as authController from './auth.controller';
import { validateBody } from '../../middlewares/validateBody';
import { signupSchema, loginSchema } from './auth.schema';
import rateLimit from 'express-rate-limit';
import { isAuth } from '../../middlewares/isAuth';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/signup', authLimiter, validateBody(signupSchema), authController.signup);
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.post('/logout', isAuth, authController.logout);

export default router;