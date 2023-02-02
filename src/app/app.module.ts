import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgSelectModule } from '@ng-select/ng-select';

import { NgCeilPipeModule } from 'angular-pipes';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RecordsComponent } from './components/records/records.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { MaterialModule } from './material/material.module';
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { AuthInterceptorService } from './services/interceptors/auth.interceptor.service';
import { SnackBarService } from './services/snack-bar.service';
import { TokenStorageService } from './services/token.service';

@NgModule({
  declarations: [AppComponent, RegistrationComponent, LoginComponent, NotFoundComponent, RecordsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgSelectModule,
    NgCeilPipeModule,
  ],
  providers: [
    HttpService,
    AuthService,
    TokenStorageService,
    SnackBarService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
