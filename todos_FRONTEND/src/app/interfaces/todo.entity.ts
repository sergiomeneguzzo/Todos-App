import { User } from '../shared/auth.service';

export interface Todo {
  id?: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  expired?: boolean;
  createdBy?: User;
  assignedTo?: User;
}
