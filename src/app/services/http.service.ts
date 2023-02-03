import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { Doctor } from '../interfaces/doctor.interface';
import { PaginatedRecords } from '../interfaces/paginated-records.interface';
import { Record } from '../interfaces/record.iterface';

@Injectable()
export class HttpService {
  private URL = environment.URL;

  constructor(private http: HttpClient) {}

  public getAllDoctors = (): Observable<Doctor[]> => this.http.get<Doctor[]>(`${this.URL}/doctors`);

  public getAllRecords = (pageSize: number, page: number, sort = ''): Observable<PaginatedRecords> =>
    this.http.get<PaginatedRecords>(`${this.URL}/records?pageSize=${pageSize}&page=${page}&sort=${sort}`);

  public getRecord = (recordId: string): Observable<Record> => this.http.get<Record>(`${this.URL}/record/${recordId}`);

  public editRecord = (recordId: string, record: Record): Observable<Record> =>
    this.http.patch<Record>(`${this.URL}/record/${recordId}`, record);

  public createNewRecord = (record: Record): Observable<Record> => this.http.post<Record>(`${this.URL}/record`, record);

  public deleteRecord = (recordId: string): Observable<Record> =>
    this.http.delete<Record>(`${this.URL}/record/${recordId}`);
}
