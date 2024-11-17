import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { User } from '../../shared/auth.service';
import { TodosService } from '../../shared/todos.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrl: './assign.component.css',
})
export class AssignComponent {
  closeResult = '';
  selectedUserId?: string;
  users: User[] = [];
  @Input() todoId!: string;
  @Output() assignmentUpdated = new EventEmitter<void>();

  constructor(
    protected modalService: NgbModal,
    private todosService: TodosService
  ) {}

  ngOnInit(): void {
    this.todosService.getUsers();
    this.todosService.users$.subscribe((users) => {
      this.users = users;
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  saveAssignment(): void {
    if (this.todoId && this.selectedUserId !== undefined) {
      this.todosService.assign(this.todoId, this.selectedUserId).subscribe(
        () => {
          this.assignmentUpdated.emit();
          this.modalService.dismissAll();
        },
        (error) => console.error("Errore nell'assegnazione del todo", error)
      );
    }
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
