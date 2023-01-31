import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { Record } from '../interfaces/record.iterface';

@Injectable()
export class HttpService {
  private URL = environment.URL;

  constructor(private http: HttpClient) {}

  public getAllRecords = (headers: HttpHeaders): Observable<Record[]> =>
    this.http.get<Record[]>(this.URL + '/records', {
      headers: headers,
    });
}
