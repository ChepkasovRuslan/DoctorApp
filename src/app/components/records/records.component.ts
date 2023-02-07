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

  public selectedSortOption = this.sortOptions[2];
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

  public getRecords() {
    this.sortDirectionVisibility = this.selectedSortOption.key !== this.NONE_SORT_OPTION;

    this.httpService
      .getAllRecords(
        this.PAGE_SIZE,
        this.currentPage,
        this.selectedSortOption.key ? this.selectedSortOption.key : this.NONE_SORT_OPTION,
        this.selectedSortDirection.key ? this.selectedSortDirection.key : this.ASC_SORT_DIRECTION_KEY,
        this.filtrationFromDate ? this.filtrationFromDate!!.toString() : '',
        this.filtrationToDate ? this.filtrationToDate!!.toString() : ''
      )
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

  public showEditDialog(record: Record) {
    this.dialog
      .open(EditDialogComponent, {
        width: '642px',
        height: '615px',

        data: {
          record: record,
          doctors: this.doctors,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getRecords();
          this.snackBarService.showSnack(this.snackBarService.RECORD_EDITED);
        }
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

  public changeFiltrationVisibility() {
    this.filtrationVisibility = !this.filtrationVisibility;

    if (!this.filtrationVisibility) {
      this.filtrationFromDate = null;
      this.filtrationToDate = null;

      this.getRecords();
    }
  }

  public nextPage() {
    if (this.currentPage < Math.ceil(this.totalCountOfElements / this.PAGE_SIZE)) {
      this.currentPage++;

      if (this.sortDirectionVisibility) {
        this.getRecords();
        return;
      }

      this.getRecords();
    }
  }

  public previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;

      if (this.sortDirectionVisibility) {
        this.getRecords();
        return;
      }

      this.getRecords();
    }
  }
}
