import { Injectable } from '@angular/core';

@Injectable()
export class TokenStorageService {
  private ACCESS_TOKEN_KEY = 'auth-token';
  private REFRESH_TOKEN_KEY = 'auth-refresh-token';
  private LOGIN_KEY = 'auth-login';

  public saveToken(token: string): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);

    const login = this.getLogin();
    if (login) {
      this.saveLogin(login);
    }
  }

  public getToken = (): string | null => localStorage.getItem(this.ACCESS_TOKEN_KEY);

  public saveRefreshToken(token: string): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  public getRefreshToken = (): string | null => window.localStorage.getItem(this.REFRESH_TOKEN_KEY);

  public saveLogin(login: string): void {
    localStorage.removeItem(this.LOGIN_KEY);
    localStorage.setItem(this.LOGIN_KEY, login);
  }

  public getLogin = (): string | null => localStorage.getItem(this.LOGIN_KEY);

  public clearData(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.LOGIN_KEY);
  }
}
