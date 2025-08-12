import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let headers = {};

  // No agregar el header si:
  // - No está autenticado
  // - Es una petición de auth
  // - Es una petición a stockfish.online
  if (!authService.check()) return next(req);
  if (!req.url.includes('auth') && !req.url.includes('stockfish.online')) {
    headers = {
      setHeaders: {
        Authorization: `Bearer ${authService.getAccessToken()?.replace(/"/g, '')}`,
      },
    }
  }

  const clonedRequest = req.clone(headers);
  return next(clonedRequest);
};
