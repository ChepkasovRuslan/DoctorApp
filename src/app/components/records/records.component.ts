import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { Doctor } from '../../interfaces/doctor.interface';
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

          this.snackBarService.showErrorSnack(errorResponse.error.errors.map((e: { msg: string }) => e.msg).join('. '));
          return throwError(() => new Error(errorResponse.status.toString()));
        })
      )
      .subscribe((result) => (this.doctors = result));
  }

  public doctors: Doctor[] = [];
  public selectedDoctorId = '';
}
