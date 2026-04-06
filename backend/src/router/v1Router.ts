import { Router } from 'express';
import authRouter from '../resources/auth/auth.router';
import noteRouter from '../resources/note/note.router';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.use('/auth', authRouter);
router.use('/notes', isAuth, noteRouter);

export default router;