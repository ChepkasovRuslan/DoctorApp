import { Component, Inject } from '@angular/core';

import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private httpService: HttpService, @Inject(AuthService) private authService: AuthService) {}
}
