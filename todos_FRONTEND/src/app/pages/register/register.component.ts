import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { urlValidator } from '../../validators/url-validator';
import { NotificationComponent } from '../../components/notification/notification.component';
import { strongPasswordValidator } from '../../validators/strongpassword-validator';
import { customEmailValidator } from '../../validators/email-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  registerError!: string;

  passwordVisible = false;
  confirmPasswordVisible = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, customEmailValidator()]],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: [
        '',
        [Validators.required, this.matchPasswordValidator('password')],
      ],
      picture: ['', [urlValidator()]],
    });
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  passwordMatcher(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  register(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.isLoading = true;

    let { firstName, lastName, username, password, confirmPassword, picture } =
      this.registerForm.value;

    if (!picture) {
      picture =
        'https://static.vecteezy.com/ti/vettori-gratis/p1/2318271-icona-profilo-utente-vettoriale.jpg';
    }

    this.authService
      .register(
        firstName,
        lastName,
        username,
        picture,
        password,
        confirmPassword
      )
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.notification.showSuccess('Registrazione avvenuta con successo!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        (error) => {
          this.isLoading = false;
          this.registerError = 'Errore nella registrazione. Riprova.';
          this.notification.showError('Errore nella registrazione.');
        }
      );
  }

  matchPasswordValidator(passwordField: string) {
    return (control: any) => {
      const form = control.parent;
      if (form) {
        const password = form.get(passwordField)?.value;
        return password === control.value ? null : { passwordMismatch: true };
      }
      return null;
    };
  }
}
