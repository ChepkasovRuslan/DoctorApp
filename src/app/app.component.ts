import { Component, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public headerTitle = '';

  constructor(
    private router: Router,
    private httpService: HttpService,
    @Inject(AuthService) private authService: AuthService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        switch (event.url) {
          case '/registration':
            this.headerTitle = 'Зарегистрироваться в системе';
            break;
          case '/login':
            this.headerTitle = 'Войти в систему';
            break;
          default:
            this.headerTitle = 'Page not found';
        }
      }
    });
  }
}
