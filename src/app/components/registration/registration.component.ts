import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { TokenStorageService } from '../../services/token.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private tokenStorageService: TokenStorageService
  ) {}

  public login = '';
  public password = '';
  public repeatPassword = '';

  public registerUser() {
    this.authService
      .registerUser(this.login, this.password, this.repeatPassword)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.clearFields();

          if (errorResponse.status === 0) {
            this.snackBarService.showErrorSnack(this.snackBarService.NO_CONNECTION);
            return throwError(() => new Error(this.snackBarService.NO_CONNECTION));
          }

          return throwError(() => new Error(errorResponse.status.toString()));
        })
      )
      .subscribe(async (result) => {
        this.tokenStorageService.saveToken(result.accessToken);
        this.tokenStorageService.saveRefreshToken(result.refreshToken);

        await this.router.navigate(['/login']);
      });
  }

  private clearFields() {
    this.login = '';
    this.password = '';
    this.repeatPassword = '';
  }
}
