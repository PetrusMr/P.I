import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('usuarioLogado');
  
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};