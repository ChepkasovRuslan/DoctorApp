import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenStorageService.getToken();

    if (token) {
      // if (this.tokenExpired(token)) {
      //   const refreshToken = this.tokenStorageService.getRefreshToken();
      //   this.authService.refreshToken(refreshToken!!).subscribe((result) => {
      //     this.tokenStorageService.saveToken(result.accessToken);
      //     this.tokenStorageService.saveRefreshToken(result.refreshToken);
      //   });
      // } else {
      request = request.clone({
        setHeaders: { Authorization: token },
      });
      // }
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

  private tokenExpired(token: string) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }
}
