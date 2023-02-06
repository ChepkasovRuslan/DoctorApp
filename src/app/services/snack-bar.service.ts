import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorResponse } from '../interfaces/error-response.interface';

@Injectable()
export class SnackBarService {
  public readonly INVALID_LOGIN_OR_PASSWORD = 'Invalid login or password';
  public readonly NO_CONNECTION = 'No connection with server';
  public readonly INVALID_DATA = 'Invalid input data';
  public readonly UNAUTHORIZED = 'Unauthorized';
  public readonly RECORD_ADDED = 'Record added';
  public readonly RECORD_DELETED = 'Record deleted';
  public readonly RECORD_EDITED = 'Record edited';
  public readonly RECORD_NOT_FOUND = 'Record not found';
  public readonly LOGIN_EXISTS = 'Login already exists';

  constructor(private snackBar: MatSnackBar) {}

  public showSnack(message: string) {
    this.snackBar.open(message, 'close', {
      duration: 4000,
    });
  }

  public showHttpErrors(httpErrorResponse: HttpErrorResponse) {
    this.snackBar.open(httpErrorResponse.error.errors.map((err: ErrorResponse) => err.msg).join('. '), 'close', {
      duration: 4000,
    });
  }
}
