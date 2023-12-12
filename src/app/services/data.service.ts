import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { MessageService } from 'primeng/api';
import { EMPTY, Observable, catchError, of, tap } from 'rxjs';
import { LightLog } from '../models/lightlog.model';
import { User } from '../models/user.model';
import { error } from 'console';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  url: string = "https://localhost:7090";
  headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private msg: MessageService,
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

  deleteLightLog(id: string): Observable<string> {
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

  // deleteLightLogs(ids: number[]): Observable<string> {
  //   return this.http.delete<string>('https://localhost:7090/lightlogs', ids).pipe(
  //     tap((response) => {
  //       this.msg.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'LightLog was deleted.',
  //         life: 2000,
  //       });
  //       return response;
  //     }),
  //     catchError((error) => {
  //       this.msg.add({
  //         severity: 'error',
  //         summary: `Error ${error.status}`,
  //         detail: `${error.statusText}`,
  //         life: 2000,
  //       });
  //       return of('');
  //     }),
  //   );
  // }

  postUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.url}/users`, user).pipe()
  }
}