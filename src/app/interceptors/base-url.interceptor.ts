import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const base = (environment.apiUrl ?? '').replace(/\/+$/, ''); // sin '/' al final

  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  if (req.url.startsWith('assets/')) {
    return next(req);
  }

  const path = req.url.replace(/^\/+/, '');

  const clonedRequest = req.clone({
    url: `${base}/${path}`, 
    setHeaders: {
      Accept: 'application/json',
    },
  });

  return next(clonedRequest);
};
