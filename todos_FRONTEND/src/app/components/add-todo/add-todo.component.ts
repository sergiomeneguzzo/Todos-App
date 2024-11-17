import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Todo } from '../../interfaces/todo.entity';
import { NgForm } from '@angular/forms';
import { AuthService, User } from '../../shared/auth.service';
import { TodosService } from '../../shared/todos.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'],
})
export class AddTodoComponent implements OnInit {
  @Output() add = new EventEmitter<Todo>();
  title: string = '';
  dueDate: string | null = null;
  selectedUserId?: User;
  users: User[] = [];

  constructor(private todosService: TodosService) {}

  ngOnInit(): void {
    this.todosService.getUsers();
    this.todosService.users$.subscribe((users) => {
      this.users = users;
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const newTodo: Todo = {
        title: this.title,
        dueDate: this.dueDate,
        completed: false,
        assignedTo: this.selectedUserId || undefined,
      };
      this.add.emit(newTodo);
      this.title = '';
      this.dueDate = null;
      this.selectedUserId = undefined;
    }
  }
}
