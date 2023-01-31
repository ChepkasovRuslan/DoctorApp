import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) {}

  public login = '';
  public password = '';
  public repeatPassword = '';

  public registerUser() {
    this.authService.registerUser(this.login, this.password, this.repeatPassword).subscribe((result) => {
      this.tokenStorageService.saveToken(result.accessToken);
      this.tokenStorageService.saveRefreshToken(result.refreshToken);
    });
  }
}
