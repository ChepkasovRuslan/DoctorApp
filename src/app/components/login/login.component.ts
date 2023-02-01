import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { TokenStorageService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private tokenStorageService: TokenStorageService
  ) {}

  private INVALID_LOGIN_OR_PASSWORD = 'Invalid login or password';

  public login = '';
  public password = '';

  public loginUser() {
    this.authService
      .loginUser(this.login, this.password)
      .pipe(
        catchError(() => {
          this.snackBarService.showErrorSnack(this.INVALID_LOGIN_OR_PASSWORD);
          this.clearFields();

          return throwError(() => new Error(this.INVALID_LOGIN_OR_PASSWORD));
        })
      )
      .subscribe(async (result) => {
        this.tokenStorageService.saveToken(result.accessToken);
        this.tokenStorageService.saveRefreshToken(result.refreshToken);
        this.tokenStorageService.saveLogin(result.login);

        await this.router.navigate(['/records']);
      });
  }

  private clearFields() {
    this.login = '';
    this.password = '';
  }
}
