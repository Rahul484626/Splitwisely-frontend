import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { tokenStorage } from './token-storage';

let refreshInFlight: Promise<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const access = tokenStorage.getAccess();
  const isAuthRoute = /\/auth\/(login|register|refresh|logout)\b/.test(req.url);

  const authedReq = access && !isAuthRoute ? req.clone({ setHeaders: { Authorization: `Bearer ${access}` } }) : req;

  return next(authedReq).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401 || isAuthRoute) {
        return throwError(() => err);
      }

      if (!tokenStorage.getRefresh()) {
        void auth.logout();
        return throwError(() => err);
      }

      if (!refreshInFlight) {
        refreshInFlight = auth.refresh().finally(() => {
          refreshInFlight = null;
        });
      }

      return from(refreshInFlight).pipe(
        switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
        catchError((refreshErr) => {
          void auth.logout();
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
