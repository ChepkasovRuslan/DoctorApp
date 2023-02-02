import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { catchError, throwError } from 'rxjs';

import { Doctor } from '../../interfaces/doctor.interface';
import { PaginatedRecords } from '../../interfaces/paginated-records.interface';
import { Record } from '../../interfaces/record.iterface';
import { HttpService } from '../../services/http.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
})
export class RecordsComponent {
  constructor(private httpService: HttpService, private snackBarService: SnackBarService) {
    httpService
      .getAllDoctors()
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 0) {
            this.snackBarService.showErrorSnack(this.snackBarService.NO_CONNECTION);
            return throwError(() => new Error(this.snackBarService.NO_CONNECTION));
          }

          return throwError(() => new Error());
        })
      )
      .subscribe((result) => (this.doctors = result));

    httpService
      .getAllRecords()
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 0) {
            this.snackBarService.showErrorSnack(this.snackBarService.NO_CONNECTION);
            return throwError(() => new Error(this.snackBarService.NO_CONNECTION));
          }

          return throwError(() => new Error());
        })
      )
      .subscribe((result) => {
        this.paginatedRecords = result;
        let records = this.paginatedRecords.content;
        for (let record of records) {
          record.receptionDate = new Date(record.receptionDate).toLocaleDateString();
        }

        this.records = new MatTableDataSource<Record>(records);
      });
  }

  public doctors: Doctor[] = [];
  public selectedDoctorId = '';

  public readonly displayedColumns: string[] = ['patient', 'doctor', 'date', 'complaints', 'change'];
  public paginatedRecords: PaginatedRecords = {
    content: [],
    page: '',
    pageSize: '',
    elementsOnPage: 0,
    totalCountOfElements: 0,
  };
  public records: MatTableDataSource<Record> = new MatTableDataSource<Record>();

  public deleteRecord(record: Record) {
    // TODO: delete
  }

  public editRecord(record: Record) {
    // TODO: record
  }
}
