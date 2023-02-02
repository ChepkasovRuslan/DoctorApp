import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarService {
  public INVALID_LOGIN_OR_PASSWORD = 'Invalid login or password';
  public NO_CONNECTION = 'No connection with server';

  constructor(private snackBar: MatSnackBar) {}

  public showErrorSnack(err: string) {
    this.snackBar.open(err, 'close', {
      duration: 4000,
    });
  }
}
