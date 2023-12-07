import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, of, tap } from 'rxjs';
import { LightLog } from '../models/lightlog.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject (HttpClient);
  private msg = inject (MessageService);
  url: string = "https://localhost:7090";

  headers: HttpHeaders;

  constructor(
  ) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  getLightLogs(): Observable<LightLog[]> {
    this.msg.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Getting Managers from the database',
      life: 2000,
    });
    return this.http.get<LightLog[]>(`${this.url}/lightlogs`).pipe(
      tap((response) => {
        this.msg.add({
          severity: 'success',
          summary: 'Success',
          detail: 'LightLogs were downloaded',
          life: 2000,
        });
        return response;
      }),
      catchError((error) => {
        this.msg.add({
          severity: 'error',
          summary: `Error ${error.status}`,
          detail: `${error.statusText}`,
          life: 2000,
        });
        return of([] as LightLog[]);
      }),
    );
  }

  deleteLightLogs(id: string): Observable<string> {
    return this.http.delete<string>(`${this.url}/lightlogs/${id}`).pipe(
      tap((response) => {
        this.msg.add({
          severity: 'success',
          summary: 'Success',
          detail: 'LightLog was deleted.',
          life: 2000,
        });

        return response;
      }),
      catchError((error) => {
        this.msg.add({
          severity: 'error',
          summary: `Error ${error.status}`,
          detail: `${error.statusText}`,
          life: 2000,
        });
        return of('');
      }),
    );
  }
}


/* import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { LightLog } from '../models/lightlog.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  headers: HttpHeaders;


  constructor(
    private http: HttpClient,
    private msg: MessageService,
  ) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getLightLogs(): Observable<LightLog[]> {
    this.msg.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Getting LightLogs from the database',
      life: 2000,
    });
    return this.http.get<LightLog[]>(`https://localhost:7090/api/LightLogs`).pipe(
      tap((response) => {
        this.msg.add({
          severity: 'success',
          summary: 'Success',
          detail: 'LightLogs were downloaded',
          life: 2000,
        });
        return response;
      }),
      catchError((error) => {
        this.msg.add({
          severity: 'error',
          summary: `Error ${error.status}`,
          detail: `${error.statusText}`,
          life: 2000,
        });
        return of([] as LightLog[]);
      }),
    );
  }
}
*/
