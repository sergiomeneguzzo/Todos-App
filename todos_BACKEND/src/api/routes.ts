import express, { Router } from 'express';
import todorouter from './todo/todo.router';
import userRouter from './user/user-router';
import authRouter from './auth/auth-router';

const router = Router();

router.use('/todo', todorouter);
router.use('/users', userRouter);
router.use(authRouter);

export default router;
