import { isMongoId } from 'class-validator';
import { NotFoundError } from '../../errors/not-found';
import { Todo } from './todo.entity';
import { TodoModel } from './todo.model';
import { User } from '../user/user.model';
import { use } from 'passport';
import { NotFoundUserError } from '../../errors/not-found-user';
import { Types } from 'mongoose';

export class TodoService {
  async list(completed: boolean, userId: string): Promise<Todo[]> {
    let query: any = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    };
    if (!completed) {
      query.completed = false;
    }
    const list = await TodoModel.find(query)
      .populate('createdBy')
      .populate('assignedTo')
      .exec();
    return list;
  }

  async insertTodo(
    todo: Todo,
    userId: string,
    assignedTo: string,
  ): Promise<Todo> {
    const creatorExists = await User.findById(userId).exec();
    if (!creatorExists) {
      throw new NotFoundUserError();
    }
    if (assignedTo) {
      const assignExists = await User.findById(assignedTo).exec();
      if (!assignExists) {
        throw new NotFoundUserError();
      }
    }

    const myNewTodo = await TodoModel.create({
      ...todo,
      createdBy: userId,
      assignedTo: assignedTo || undefined,
    });

    return myNewTodo;
  }

  async check(id: string, userId: string): Promise<Todo> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const todo = await TodoModel.findOne({
      _id: id,
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    }).exec();
    if (!todo) {
      throw new NotFoundError();
    }
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true },
    ).exec();
    if (!updatedTodo) {
      throw new NotFoundError();
    }
    return updatedTodo;
  }

  async uncheck(id: string, userId: string): Promise<Todo> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const todo = await TodoModel.findOne({
      _id: id,
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    }).exec();
    if (!todo) {
      throw new NotFoundError();
    }
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      id,
      { completed: false },
      { new: true },
    ).exec();
    if (!updatedTodo) {
      throw new NotFoundError();
    }
    return updatedTodo;
  }
  async deleteTodo(todoId: string): Promise<void> {
    if (!isMongoId(todoId)) {
      throw new Error('Invalid todoID format');
    }
    const deletedTodo = await TodoModel.findByIdAndDelete(todoId).exec();
    if (!deletedTodo) {
      throw new NotFoundError();
    }
  }

  async assignUserToTodo(todoId: string, assignedTo: string): Promise<Todo> {
    if (!isMongoId(todoId) || !isMongoId(assignedTo)) {
      throw new Error('Invalid ID format');
    }
    const userExists = await User.findById(assignedTo).exec();
    if (!userExists) {
      throw new NotFoundUserError();
    }
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      todoId,
      { assignedTo: assignedTo },
      { new: true },
    ).exec();

    if (!updatedTodo) {
      throw new NotFoundError();
    }
    return updatedTodo;
  }
}

export default new TodoService();
