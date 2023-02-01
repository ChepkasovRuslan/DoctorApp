import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

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

  public login = '';
  public password = '';

  public loginUser() {
    this.authService
      .loginUser(this.login, this.password)
      .pipe(
        catchError(() => {
          this.snackBarService.showErrorSnack('Неправильный логин или пароль');
          this.clearFields();
          return of({ accessToken: '', refreshToken: '', login: '' });
        })
      )
      .subscribe((result) => {
        this.tokenStorageService.saveToken(result.accessToken);
        this.tokenStorageService.saveRefreshToken(result.refreshToken);
        this.tokenStorageService.saveLogin(result.login);

        this.router.navigate(['/records']);
      });
  }

  private clearFields() {
    this.login = '';
    this.password = '';
  }
}
