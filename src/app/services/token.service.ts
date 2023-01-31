import { Injectable } from '@angular/core';

import { User } from '../interfaces/user.interface';

@Injectable()
export class TokenStorageService {
  private ACCESS_TOKEN_KEY = 'auth-token';
  private REFRESH_TOKEN_KEY = 'auth-refreshtoken';
  private USER_KEY = 'auth-user';

  public saveToken(token: string): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);

    const user = this.getUser();
    if (user && user.id) {
      this.saveUser(user);
    }
  }

  public getToken = (): string | null => localStorage.getItem(this.ACCESS_TOKEN_KEY);

  public saveRefreshToken(token: string): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  public getRefreshToken = (): string | null => window.localStorage.getItem(this.REFRESH_TOKEN_KEY);

  public saveUser(user: User): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public getUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
}
