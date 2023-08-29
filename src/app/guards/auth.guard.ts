import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const check = authService.getAuthToken();
  if (!check) {
    router.navigate(['/login']);
    return false;
  } else {
    return true;
  }
};

export const authGuardSession: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const check = authService.getAuthToken();
  if (!check) {
    return true;
  } else {
    router.navigate(['/admin-panel/productos']);
    return false;
  }
};
