import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
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
    private tokenStorageService: TokenStorageService
  ) {}

  public login = '';
  public password = '';

  public loginUser() {
    this.authService.loginUser(this.login, this.password).subscribe((result) => {
      this.tokenStorageService.saveToken(result.accessToken);
      this.tokenStorageService.saveRefreshToken(result.refreshToken);
      this.tokenStorageService.saveLogin(result.login);
    });
  }
}
