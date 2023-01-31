import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExtendedTokens } from '../interfaces/extended-tokens.interface';
import { Record } from '../interfaces/record.iterface';
import { Tokens } from '../interfaces/tokens.interface';

@Injectable()
export class HttpService {
  private URL = 'http://localhost:8000';

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

  public getAllRecords = (headers: HttpHeaders): Observable<Record[]> =>
    this.http.get<Record[]>(this.URL + '/records', {
      headers: headers,
    });
}
