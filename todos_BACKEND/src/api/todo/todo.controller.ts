import { NextFunction, Request, Response } from 'express';
import TodoService from './todo.service';
import { CreateTodoDTO } from './todo.dto';
import { Todo } from './todo.entity';
import todoService from './todo.service';
import { TypedRequest } from '../../utils/typed-request';
import { User } from '../user/user.model';
import { NotFoundUserError } from '../../errors/not-found-user';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user!;
    const completed = req.query.completed === 'true';
    const todo = await TodoService.list(completed, user.id!);
    res.json(todo);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const insert = async (
  req: TypedRequest<CreateTodoDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const { title, dueDate, assignedTo } = req.body;

    console.log('Request received with:', {
      title,
      dueDate,
      assignedTo,
      userId: user.id,
    });

    const TodoUser = await User.findById(user.id);
    const TodoAssignedUser = await User.findById(assignedTo);

    if (assignedTo != undefined && TodoAssignedUser == null) {
      throw new NotFoundUserError();
    } else if (
      (assignedTo != undefined && TodoAssignedUser != null) ||
      assignedTo == undefined
    ) {
      const newTodo: Todo = {
        title: title,
        dueDate: dueDate,
        completed: false,
      };

      const saved = await todoService.insertTodo(
        newTodo,
        TodoUser?.id,
        TodoAssignedUser?.id,
      );
      console.log(saved);
      res.json(saved);
    }
  } catch (err) {
    next(err);
  }
};

export const check = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const { todoId } = req.params;

    const todo = await todoService.check(todoId, user?.id!);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

export const uncheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const { todoId } = req.params;

    const todo = await todoService.uncheck(todoId, user?.id!);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { todoId } = req.params;
    await TodoService.deleteTodo(todoId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const assign = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const { assignedTo } = req.body;

    console.log(`Assigning TODO ${id} to user ${assignedTo}`);

    const updated = await todoService.assignUserToTodo(id, assignedTo);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};
