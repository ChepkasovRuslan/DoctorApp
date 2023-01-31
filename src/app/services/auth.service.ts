import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { ExtendedTokens } from '../interfaces/extended-tokens.interface';
import { Tokens } from '../interfaces/tokens.interface';

@Injectable()
export class AuthService {
  private URL = environment.URL;

  constructor(private http: HttpClient) {}

  public registerUser = (login: string, password: string, confirmedPassword: string): Observable<Tokens> =>
    this.http.post<Tokens>(this.URL + '/auth/registration', {
      login: login,
      password: password,
      confirmedPassword: confirmedPassword,
    });

  public loginUser = (login: string, password: string): Observable<ExtendedTokens> =>
    this.http.post<ExtendedTokens>(this.URL + '/auth/login', {
      login: login,
      password: password,
    });

  public refreshToken = (refreshToken: string): Observable<Tokens> =>
    this.http.post<Tokens>(this.URL + '/token/refresh', {
      refreshToken: refreshToken,
    });

  public setTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };
}
