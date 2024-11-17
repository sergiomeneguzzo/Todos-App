import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import { Todo } from './todo.entity';

const TodoSchema = new mongoose.Schema<Todo>({
  title: { type: String, required: true },
  dueDate: { type: String },
  completed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

TodoSchema.virtual('expired').get(function (this: Todo) {
  if (!!this.dueDate) {
    const dueDate = new Date(this.dueDate);
    console.log(this.completed, dueDate < new Date());
    return !this.completed && dueDate < new Date();
  }

  return false;
});

TodoSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const TodoModel = mongoose.model<Todo>('Todo', TodoSchema);
