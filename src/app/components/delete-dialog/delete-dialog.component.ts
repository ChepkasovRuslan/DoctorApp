import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css'],
})
export class DeleteDialogComponent {
  constructor(
    private httpService: HttpService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  public submitDelete() {
    this.httpService
      .deleteRecord(this.data)
      .pipe(
        catchError((err: Error) => {
          this.snackBarService.showSnack(err.message);
          return of({});
        })
      )
      .subscribe(() => this.close());
  }

  private close() {
    this.dialogRef.close();
  }
}
