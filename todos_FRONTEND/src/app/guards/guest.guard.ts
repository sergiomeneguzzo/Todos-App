import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authSrv = inject(AuthService);

  const isAuthenticated = authSrv.isLoggedIn();

  if (isAuthenticated) {
    router.navigateByUrl('/todos');
    return false;
  } else {
    return true;
  }
};
