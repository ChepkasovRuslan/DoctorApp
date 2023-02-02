import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarService {
  public readonly INVALID_LOGIN_OR_PASSWORD = 'Invalid login or password';
  public readonly NO_CONNECTION = 'No connection with server';
  public readonly INVALID_DATA = 'Invalid input data';
  public readonly UNAUTHORIZED = 'Unauthorized';
  public readonly RECORD_ADDED = 'Record added';
  public readonly RECORD_DELETED = 'Record deleted';
  public readonly RECORD_EDITED = 'Record edited';

  constructor(private snackBar: MatSnackBar) {}

  public showSnack(message: string) {
    this.snackBar.open(message, 'close', {
      duration: 4000,
    });
  }
}
