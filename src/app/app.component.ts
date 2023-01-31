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
  public currentRoute: any;

  constructor(
    private router: Router,
    private httpService: HttpService,
    @Inject(AuthService) private authService: AuthService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/registration') {
          this.headerTitle = 'Зарегистрироваться в системе';
        }
      }
    });
  }
}
