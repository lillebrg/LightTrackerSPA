import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MessageService, ConfirmationService} from 'primeng/api';
import { DataService } from './services/data.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgbModule, BrowserAnimationsModule, FormsModule],
  providers: [provideClientHydration(),provideHttpClient(withFetch()) ,DataService, MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
