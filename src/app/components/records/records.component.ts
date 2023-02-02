import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { catchError, throwError } from 'rxjs';

import { Doctor } from '../../interfaces/doctor.interface';
import { PaginatedRecords } from '../../interfaces/paginated-records.interface';
import { Record } from '../../interfaces/record.iterface';
import { HttpService } from '../../services/http.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
})
export class RecordsComponent {
  constructor(
    private httpService: HttpService,
    private snackBarService: SnackBarService,
    private deleteDialog: MatDialog
  ) {
    this.getDoctors();
    this.getRecords();
  }

  public readonly PAGE_SIZE = 5;
  public currentPage = 1;
  public totalCountOfElements = 1;

  public doctors: Doctor[] = [];

  public newRecord: Record = {
    patientFullName: '',
    doctor: '',
    receptionDate: new Date().toString(),
    complaints: '',
  };

  public readonly displayedColumns: string[] = ['patient', 'doctor', 'date', 'complaints', 'change'];
  public paginatedRecords: PaginatedRecords = {
    content: [],
    page: '',
    pageSize: '',
    elementsOnPage: 0,
    totalCountOfElements: 0,
  };
  public records: MatTableDataSource<Record> = new MatTableDataSource<Record>();

  private getDoctors() {
    this.httpService
      .getAllDoctors()
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 0) {
            this.snackBarService.showSnack(this.snackBarService.NO_CONNECTION);
            return throwError(() => new Error(this.snackBarService.NO_CONNECTION));
          }

          return throwError(() => new Error());
        })
      )
      .subscribe((result) => {
        this.doctors = result;
        this.newRecord.doctor = result[0].id;
      });
  }

  private getRecords() {
    this.httpService
      .getAllRecords(this.PAGE_SIZE, this.currentPage)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status !== 401) {
            if (errorResponse.status === 0) {
              this.snackBarService.showSnack(this.snackBarService.NO_CONNECTION);
              return throwError(() => new Error(this.snackBarService.NO_CONNECTION));
            }

            return throwError(() => new Error());
          }
          this.snackBarService.showSnack(this.snackBarService.UNAUTHORIZED);
          return throwError(() => new Error(this.snackBarService.UNAUTHORIZED));
        })
      )
      .subscribe((result) => {
        this.paginatedRecords = result;

        this.totalCountOfElements = result.totalCountOfElements;

        let records = this.paginatedRecords.content;

        this.records = new MatTableDataSource<Record>(records);
      });
  }

  private clearFields() {
    this.newRecord.patientFullName = '';
    this.newRecord.complaints = '';
  }

  public addRecord() {
    this.httpService
      .createNewRecord(this.newRecord)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status !== 401) {
            if (errorResponse.status === 0) {
              this.snackBarService.showSnack(this.snackBarService.NO_CONNECTION);
              return throwError(() => new Error(this.snackBarService.NO_CONNECTION));
            }

            this.snackBarService.showSnack(this.snackBarService.INVALID_DATA);
            return throwError(() => new Error(this.snackBarService.INVALID_DATA));
          }
          this.snackBarService.showSnack(this.snackBarService.UNAUTHORIZED);
          return throwError(() => new Error(this.snackBarService.UNAUTHORIZED));
        })
      )
      .subscribe(() => {
        this.getRecords();
        this.clearFields();
        this.snackBarService.showSnack(this.snackBarService.RECORD_ADDED);
      });
  }

  public deleteRecord(recordId: string) {
    this.httpService
      .deleteRecord(recordId)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status !== 401) {
            if (errorResponse.status === 0) {
              this.snackBarService.showSnack(this.snackBarService.NO_CONNECTION);
              return throwError(() => new Error(this.snackBarService.NO_CONNECTION));
            }
          }
          this.snackBarService.showSnack(this.snackBarService.UNAUTHORIZED);
          return throwError(() => new Error(this.snackBarService.UNAUTHORIZED));
        })
      )
      .subscribe(() => {
        this.getRecords();
        this.snackBarService.showSnack(this.snackBarService.RECORD_DELETED);
      });
  }

  public showDeleteDialog(recordId: string) {
    this.deleteDialog
      .open(DeleteDialogComponent, {
        width: '642px',
        height: '250px',
        data: recordId,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.getRecords();
      });
  }

  public nextPage() {
    if (this.currentPage < Math.ceil(this.totalCountOfElements / this.PAGE_SIZE)) this.currentPage++;
    this.getRecords();
  }

  public previousPage() {
    if (this.currentPage > 1) this.currentPage--;
    this.getRecords();
  }
}
