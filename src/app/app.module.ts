import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import {MessageService} from 'primeng/api';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, SharedModule, NgbModule],
  providers: [provideClientHydration(),provideHttpClient(withFetch()) ,DataService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
