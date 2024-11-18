import { Component, OnInit, ViewChild } from '@angular/core';
import { Todo } from '../../interfaces/todo.entity';
import { TodosService } from '../../shared/todos.service';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  TODOS: Todo[] = [];
  includeCompleted: boolean = false;
  showForm: boolean = false;
  assignedTo: string | undefined = undefined;
  isLoading: boolean = false;

  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  constructor(private todoService: TodosService) {}

  ngOnInit(): void {
    this.todoService.todos$.subscribe((todos) => {
      this.TODOS = todos.map((todo) => ({
        ...todo,
        expired: this.isTodoExpired(todo.dueDate),
      }));
    });
    this.getTodos();
  }

  getTodos(): void {
    this.isLoading = true;
    this.todoService.list(this.includeCompleted).subscribe(
      () => {
        this.isLoading = false;
      },
      (error) => {
        console.error('Errore nel recupero dei todo', error);
        this.isLoading = false;
      }
    );
  }

  addNewTodo(newTodo: Todo): void {
    this.isLoading = true;
    this.todoService.add(newTodo).subscribe(
      (todo) => {
        this.TODOS.push({
          ...todo,
          expired: this.isTodoExpired(todo.dueDate),
        });
        (this.isLoading = false), (this.showForm = false);
        this.assignedTo = undefined;
        this.notification.showSuccess('Todo aggiunto con successo!');
      },
      (error) =>
        console.error(
          "Errore nell'aggiunta del todo",
          error,
          (this.isLoading = false)
        )
    );
  }

  toggleTodoCompletion(update: { id: string; completed: boolean }): void {
    this.isLoading = true;
    const update$ = update.completed
      ? this.todoService.checkTodo(update.id)
      : this.todoService.uncheckTodo(update.id);

    update$.subscribe(
      (todo) => {
        const index = this.TODOS.findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          this.TODOS[index] = {
            ...todo,
            expired: this.isTodoExpired(todo.dueDate),
          };
        }
        this.isLoading = false;
      },
      (error) => {
        console.error("Errore nell'aggiornamento del todo", error);
        this.isLoading = false;
      }
    );
  }

  deleteTodo(todoId: string): void {
    this.isLoading = true;
    this.todoService.delete(todoId).subscribe(
      () => {
        this.isLoading = false;
        this.TODOS = this.TODOS.filter((todo) => todo.id !== todoId);
      },
      (error) =>
        console.error(
          "Errore nell'eliminazione del todo",
          error,
          (this.isLoading = false)
        )
    );
  }

  isTodoExpired(dueDate: string | null): boolean {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  }
}
