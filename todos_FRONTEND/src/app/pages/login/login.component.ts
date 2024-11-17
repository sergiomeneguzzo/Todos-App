import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm;
  loginError = '';
  isLoading = false;
  passwordVisible = false;

  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  private destroyed$ = new Subject<void>();

  constructor(
    protected fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', { validators: Validators.required }],
      password: ['', { validators: Validators.required }],
    });
  }

  togglePasswordVisibility(field: string) {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loginError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      this.authSrv
        .login(username!, password!)
        .pipe(
          catchError((err) => {
            this.isLoading = false;
            console.log(err);
            this.loginError = err.error.message;
            this.notification.showError('Credenziali errate o non valide!');
            return throwError(() => err);
          })
        )
        .subscribe((user) => {
          this.isLoading = false;
          this.notification.showSuccess('Login avvenuto con successo!');
          setTimeout(() => {
            this.router.navigate(['/todos']);
          }, 1000);
        });
    }
  }
}
