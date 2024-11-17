import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../../interfaces/todo.entity';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrl: './show-details.component.css',
})
export class ShowDetailsComponent implements OnInit {
  @Input() todo!: Todo;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  closePopup(): void {
    this.close.emit();
  }

  get createdByName(): string {
    return this.todo.createdBy
      ? this.todo.createdBy.fullName
      : 'Non specificato';
  }

  get assignedToName(): string {
    return this.todo.assignedTo
      ? this.todo.assignedTo.fullName
      : 'Non assegnato';
  }

  get createdByPicture(): string {
    return this.todo.createdBy ? this.todo.createdBy.picture : '';
  }

  get assignedToPicture(): string {
    return this.todo.assignedTo ? this.todo.assignedTo.picture : '';
  }
}
