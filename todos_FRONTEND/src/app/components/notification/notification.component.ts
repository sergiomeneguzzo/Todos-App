import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  toasts: any[] = [];

  showSuccess(message: string): void {
    this.show(message, 'success');
  }

  showError(message: string): void {
    this.show(message, 'error');
  }

  showWarning(message: string): void {
    this.show(message, 'warning');
  }

  private show(message: string, type: 'success' | 'error' | 'warning'): void {
    this.toasts.push({ text: message, type });

    setTimeout(() => this.remove(this.toasts[0]), 3000);
  }

  remove(toast: any): void {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
