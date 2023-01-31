import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Record } from '../interfaces/record.iterface';

@Injectable()
export class HttpService {
  private URL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  public getAllRecords = (headers: HttpHeaders): Observable<Record[]> =>
    this.http.get<Record[]>(this.URL + '/records', {
      headers: headers,
    });
}
