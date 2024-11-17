import { Router } from 'express';
import { me, list as userList } from './user-controller';
import { isAuthenticated } from '../../utils/auth/authenticated.middleware';

const router = Router();

router.get('/me', isAuthenticated, me);
router.get('/users', userList);

export default router;
