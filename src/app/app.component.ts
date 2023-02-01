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
  public isExitVisible = false;

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
            this.isExitVisible = false;
            break;
          case '/login':
            this.headerTitle = 'Войти в систему';
            this.isExitVisible = false;
            break;
          case '/records':
            this.headerTitle = 'Приемы';
            this.isExitVisible = true;
            break;
          default:
            this.headerTitle = 'Page not found';
            this.isExitVisible = false;
        }
      }
    });
  }
}
