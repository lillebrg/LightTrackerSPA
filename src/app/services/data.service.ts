import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { MessageService } from 'primeng/api';
import { EMPTY, Observable, catchError, of, tap } from 'rxjs';
import { LightLog } from '../models/lightlog.model';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { error } from 'console';
import { response } from 'express';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ElectricPrices } from '../models/elecprices.model';

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

  getElecPrices(dateToday: Date): Observable<ElectricPrices[]>{
    this.msg.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Getting electric prices data from api',
      life: 2000,
    });
    return this.http.get<ElectricPrices[]>(`https://www.elprisenligenu.dk/api/v1/prices/${dateToday.getFullYear()}/${dateToday.getMonth() +1}-${dateToday.getDate()}_DK1.json`).pipe(
      tap((response) => {
        this.msg.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Products were downloaded',
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
        return of([] as ElectricPrices[])
      })
    )
  }

  getProducts(): Observable<Product[]>{
    this.msg.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Getting Managers from the database',
      life: 2000,
    });
    return this.http.get<Product[]>(`${this.url}/products`).pipe(
      tap((response) => {
        this.msg.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Products were downloaded',
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
        return of([] as Product[])
      })
    )
  }

  getLightLogs(): Observable<LightLog[]> {
    this.msg.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Getting LightLogs from the database',
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

  getCustomerLightLogs(productid: string): Observable<LightLog[]> {
    this.msg.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Getting LightLogs from the database',
      life: 2000,
    });
    return this.http.get<LightLog[]>(`${this.url}/lightlogs/${productid}`).pipe(
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


  deleteLightLogs(ids: number[]): Observable<string> {
    return this.http.delete<string>(`${this.url}/lightlogs`,{body: ids}).pipe(
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

  postUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.url}/users`, user).pipe()
  }

  login(user: User): Observable<User>{
    return this.http.get<User>(`${this.url}/user/?UserName=${user.UserName}&Password=${user.Password}`,)
  } 
}