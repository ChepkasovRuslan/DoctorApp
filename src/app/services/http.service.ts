import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { Doctor } from '../interfaces/doctor.interface';
import { PaginatedRecords } from '../interfaces/paginated-records.interface';

@Injectable()
export class HttpService {
  private URL = environment.URL;

  constructor(private http: HttpClient) {}

  public getAllDoctors = (): Observable<Doctor[]> => this.http.get<Doctor[]>(this.URL + '/doctors');

  public getAllRecords = (pageSize: number, page: number, sort = ''): Observable<PaginatedRecords> =>
    this.http.get<PaginatedRecords>(this.URL + `/records?pageSize=${pageSize}&page=${page}&sort=${sort}`);
}
