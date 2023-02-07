import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { catchError, of } from 'rxjs';
import { Doctor } from 'src/app/interfaces/doctor.interface';

import { Record } from '../../interfaces/record.iterface';
import { HttpService } from '../../services/http.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
})
export class EditDialogComponent {
  constructor(
    private httpService: HttpService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { record: Record; doctors: Doctor[] }
  ) {
    this.record = JSON.parse(JSON.stringify(this.data.record));
    this.selectedDoctorId = (this.record.doctor as Doctor).id;
  }

  public record: Record;
  public selectedDoctorId: string;

  public submitEdit() {
    this.httpService
      .editRecord(this.data.record.id!!, {
        patientFullName: this.record.patientFullName,
        doctor: this.selectedDoctorId,
        complaints: this.record.complaints,
        receptionDate: this.record.receptionDate,
      })
      .pipe(
        catchError((err: Error) => {
          this.snackBarService.showSnack(err.message);
          return of({});
        })
      )
      .subscribe(() => {
        this.close();
      });
  }

  private close() {
    this.dialogRef.close();
  }
}
