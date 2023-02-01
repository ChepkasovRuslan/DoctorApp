import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { Doctor } from '../interfaces/doctor.interface';
import { Record } from '../interfaces/record.iterface';

@Injectable()
export class HttpService {
  private URL = environment.URL;

  constructor(private http: HttpClient) {}

  public getAllDoctors = (): Observable<Doctor[]> => this.http.get<Doctor[]>(this.URL + '/doctors');

  public getAllRecords = (): Observable<Record[]> => this.http.get<Record[]>(this.URL + '/records');
}
