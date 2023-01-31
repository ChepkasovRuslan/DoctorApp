import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  public getAllRecords = (headers: HttpHeaders): Observable<Record[]> =>
    this.http.get<Record[]>(this.URL + '/records', {
      headers: headers,
    });
}
