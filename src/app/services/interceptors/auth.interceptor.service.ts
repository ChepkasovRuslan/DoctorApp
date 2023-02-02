import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

import { TokenStorageService } from '../token.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private tokenStorageService: TokenStorageService, private router: Router) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenStorageService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: token },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
        return throwError(err);
      })
    );
  }
}
