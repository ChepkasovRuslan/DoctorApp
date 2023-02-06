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
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
})
export class RecordsComponent {
  constructor(private httpService: HttpService, private snackBarService: SnackBarService, private dialog: MatDialog) {
    this.getDoctors();
    this.getRecords();
  }

  private readonly PATIENT_COLUMN = 'patient';
  private readonly DOCTOR_COLUMN = 'doctor';
  private readonly DATE_COLUMN = 'date';
  private readonly COMPLAINTS_COLUMN = 'complaints';
  private readonly CHANGE_COLUMN = 'change';

  private readonly NAME_SORT_OPTION_KEY = 'patientFullName';
  private readonly NAME_SORT_OPTION_VALUE = 'Имя';
  private readonly DATE_SORT_OPTION_KEY = 'receptionDate';
  private readonly DATE_SORT_OPTION_VALUE = 'Дата';
  private readonly NONE_SORT_OPTION = 'None';

  private readonly ASC_SORT_DIRECTION_KEY = 'asc';
  private readonly ASC_SORT_DIRECTION_VALUE = 'По возрастанию';
  private readonly DESC_SORT_DIRECTION_KEY = 'desc';
  private readonly DESC_SORT_DIRECTION_VALUE = 'По убыванию';

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

  public readonly displayedColumns = [
    this.PATIENT_COLUMN,
    this.DOCTOR_COLUMN,
    this.DATE_COLUMN,
    this.COMPLAINTS_COLUMN,
    this.CHANGE_COLUMN,
  ];

  public readonly sortOptions = [
    { key: this.NAME_SORT_OPTION_KEY, value: this.NAME_SORT_OPTION_VALUE },
    { key: this.DATE_SORT_OPTION_KEY, value: this.DATE_SORT_OPTION_VALUE },
    { key: this.NONE_SORT_OPTION, value: this.NONE_SORT_OPTION },
  ];

  public readonly directions = [
    { key: this.ASC_SORT_DIRECTION_KEY, value: this.ASC_SORT_DIRECTION_VALUE },
    { key: this.DESC_SORT_DIRECTION_KEY, value: this.DESC_SORT_DIRECTION_VALUE },
  ];

  public selectedSortOption = { key: '', value: '' };
  public selectedSortDirection = { key: '', value: '' };
  public sortDirectionVisibility = false;

  public filtrationVisibility = false;
  public filtrationFromDate: Date | null = null;
  public filtrationToDate: Date | null = null;

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
      .getAllRecords(this.PAGE_SIZE, this.currentPage, 'none', 'asc')
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

        this.records = new MatTableDataSource<Record>(this.paginatedRecords.content);
      });
  }

  private getEditRecord(recordId: string) {
    this.httpService
      .getRecord(recordId)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status !== 401) {
            if (errorResponse.status === 404) {
              this.snackBarService.showSnack(this.snackBarService.RECORD_NOT_FOUND);
              return throwError(() => new Error(this.snackBarService.RECORD_NOT_FOUND));
            } else if (errorResponse.status === 0) {
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
        this.dialog
          .open(EditDialogComponent, {
            width: '642px',
            height: '615px',

            data: {
              record: result,
              doctors: this.doctors,
            },
          })
          .afterClosed()
          // eslint-disable-next-line rxjs/no-nested-subscribe
          .subscribe(async (result) => {
            if (result) {
              await this.getRecords();
              this.snackBarService.showSnack(this.snackBarService.RECORD_EDITED);
            }
          });
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

  public showDeleteDialog(recordId: string) {
    this.dialog
      .open(DeleteDialogComponent, {
        width: '642px',
        height: '250px',
        data: recordId,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getRecords();
          this.snackBarService.showSnack(this.snackBarService.RECORD_DELETED);
        }
      });
  }

  public getRecordsWithSort() {
    if (this.selectedSortOption.key === this.NONE_SORT_OPTION) {
      this.sortDirectionVisibility = false;
      this.getRecords();
      return;
    }

    this.httpService
      .getAllRecords(this.PAGE_SIZE, this.currentPage, this.selectedSortOption.key, this.selectedSortDirection.key)
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

        this.records = new MatTableDataSource<Record>(this.paginatedRecords.content);
      });
    this.sortDirectionVisibility = true;
  }

  public filterRecords() {
    if (this.filtrationFromDate && this.filtrationToDate) {
      this.records = new MatTableDataSource<Record>(
        this.records.data.filter(
          (record) =>
            new Date(record.receptionDate).getTime() >= new Date(this.filtrationFromDate!!).getTime()!! &&
            new Date(record.receptionDate).getTime() <= new Date(this.filtrationToDate!!).getTime()!!
        )
      );
    } else if (this.filtrationFromDate) {
      this.records = new MatTableDataSource<Record>(
        this.records.data.filter(
          (record) => new Date(record.receptionDate).getTime() >= new Date(this.filtrationFromDate!!).getTime()!!
        )
      );
    } else if (this.filtrationToDate) {
      this.records = new MatTableDataSource<Record>(
        this.records.data.filter(
          (record) => new Date(record.receptionDate).getTime() <= new Date(this.filtrationToDate!!).getTime()!!
        )
      );
    }
  }

  public changeFiltrationVisibility() {
    this.filtrationVisibility = !this.filtrationVisibility;

    if (!this.filtrationVisibility) {
      this.filtrationFromDate = null;
      this.filtrationToDate = null;

      this.getRecords();
    }
  }

  public showEditDialog(recordId: string) {
    this.getEditRecord(recordId);
  }

  public nextPage() {
    if (this.currentPage < Math.ceil(this.totalCountOfElements / this.PAGE_SIZE)) {
      this.currentPage++;

      if (this.sortDirectionVisibility) {
        this.getRecordsWithSort();
        return;
      }

      this.getRecords();
    }
  }

  public previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;

      if (this.sortDirectionVisibility) {
        this.getRecordsWithSort();
        return;
      }

      this.getRecords();
    }
  }
}
