import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RegistrationComponent } from './components/registration/registration.component';
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { TokenStorageService } from './services/token.service';

@NgModule({
  declarations: [AppComponent, RegistrationComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [HttpService, AuthService, TokenStorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
