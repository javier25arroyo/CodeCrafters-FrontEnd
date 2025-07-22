import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const GuestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificar directamente el token en localStorage sin usar AuthService
  const token = localStorage.getItem('access_token');
  
  if (!token) return true;

  // Redirigir a dashboard de usuario por defecto
  router.navigateByUrl('/dashboard-user');
  return false;
};
