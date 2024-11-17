import express from 'express';
import { CreateTodoDTO } from './todo.dto';
import { validate } from '../../utils/validation-middleware';
import { assign, check, deleteTodo, insert, uncheck } from './todo.controller';
import { list } from './todo.controller';
import { add } from 'lodash';
import { isAuthenticated } from '../../utils/auth/authenticated.middleware';

const router = express.Router();

router.use(isAuthenticated);
router.get('/', list);
router.post('/', validate(CreateTodoDTO), insert);
router.patch('/:todoId/check', check);
router.patch('/:todoId/uncheck', uncheck);
router.delete('/:todoId', deleteTodo);
router.patch('/:id/assign', assign);

export default router;
