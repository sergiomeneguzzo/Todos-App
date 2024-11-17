import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'todos';
  currentUser$;
  isLoading = false;

  constructor(protected authSrv: AuthService) {
    this.currentUser$ = this.authSrv.currentUser$;

    this.authSrv.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  logout() {
    this.authSrv.logout();
  }
}
