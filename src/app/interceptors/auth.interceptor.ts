import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { switchMap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (req.url.includes('/login') || req.url.includes('/refresh')) {
    return next(req);
  }

  const token = authService.getToken();
  
  if (!token) {
    return next(req);
  }

  if (authService.isTokenExpiring()) {
    if (!authService.isRefreshTokenValid()) {
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => new Error('Refresh token expirado'));
    }

    return authService.refresh().pipe(
      switchMap(() => {
        const newToken = authService.getToken();
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next(clonedReq);
      }),
      catchError((error) => {
        authService.logout();
        router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedReq);
};
