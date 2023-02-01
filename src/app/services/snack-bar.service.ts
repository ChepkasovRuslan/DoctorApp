import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public showErrorSnack(err: Error) {
    this.snackBar.open(err.message, 'close', {
      duration: 4000,
    });
  }
}
