import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Todo } from '../../interfaces/todo.entity';
import { TodosService } from '../../shared/todos.service';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.css',
})
export class TodoCardComponent {
  TODOS: Todo[] = [];
  includeCompleted: boolean = false;
  isLoading: boolean = false;

  @Input() todo!: Todo;
  @Output() check = new EventEmitter<{ id: string; completed: boolean }>();
  @Output() delete = new EventEmitter<string>();
  @Output() assign = new EventEmitter<string>();

  constructor(private todoService: TodosService) {}

  showEditModal: boolean = false;
  showConfirmDialog: boolean = false;

  isPopupVisible: boolean = false;
  selectedTodo!: Todo;

  onCheck(): void {
    this.isLoading = true;
    if (this.todo.id) {
      this.check.emit({
        id: this.todo.id,
        completed: !this.todo.completed,
      });
      this.isLoading = false;
    } else {
      console.error('ID non definito per il ToDo');
      this.isLoading = false;
    }
  }
  confirmDelete(): void {
    if (this.todo.id) {
      this.delete.emit(this.todo.id);
      this.showConfirmDialog = false;
    } else {
      console.error('ID non definito per il ToDo');
    }
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
  }

  showPopup(todo: Todo): void {
    this.selectedTodo = todo;
    this.isPopupVisible = true;
  }
  handlePopupClose(): void {
    this.isPopupVisible = false;
  }

  onAssignmentUpdated(): void {
    if (this.todo.id) {
      this.todoService.list(false).subscribe(
        (todos) => {
          const updatedTodo = todos.find((t) => t.id === this.todo.id);
          if (updatedTodo) {
            this.todo = {
              ...updatedTodo,
              expired: this.isTodoExpired(updatedTodo.dueDate),
            };
          }
        },
        (error) =>
          console.error('Errore nel recuperare il todo aggiornato', error)
      );
    } else {
      console.error('ID non definito per il ToDo');
    }
  }
  isTodoExpired(dueDate: string | null): boolean {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  }

  isDesktop: boolean = window.innerWidth >= 576;

  @HostListener('window:resize', [])
  onResize() {
    this.isDesktop = window.innerWidth >= 576;
  }
}
