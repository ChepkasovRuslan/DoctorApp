import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { Tokens } from 'src/app/interfaces/tokens.interface';

import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenStorageService: TokenStorageService, private authService: AuthService) {}

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
            return this.handle401Error(request, next);
          }
        }

        return throwError(err);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      this.authService.refreshToken(this.tokenStorageService.getRefreshToken()!!).subscribe((res) => {
        this.tokenStorageService.saveToken(res.accessToken);
        this.tokenStorageService.saveRefreshToken(res.refreshToken);
      });

      return this.authService.refreshToken(this.tokenStorageService.getRefreshToken()!!).pipe(
        switchMap((token: Tokens) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(
            (request = request.clone({
              setHeaders: { Authorization: token.accessToken },
            }))
          );
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(
            (request = request.clone({
              setHeaders: { Authorization: jwt },
            }))
          );
        })
      );
    }
  }
}
