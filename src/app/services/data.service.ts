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

  //method taking in a date as a parameter and getting electric prices for the passed in date
  getElecPrices(dateToday: Date): Observable<ElectricPrices[]>{
    this.msg.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Getting electric prices data from api',
      life: 2000,
    });
    //return http get for el price API using date parameter to get the specific day for electric prices
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
      //error handling
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
  
  //get producs method returnig array of products 
  getProducts(): Observable<Product[]>{
    this.msg.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Getting Managers from the database',
      life: 2000,
    });
    //returning a http.get getting products via APU url
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
      //error handling 
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

  //post user method taking in a user as a method
  postUser(user: User): Observable<User>{
    //return http post to the API url 
    return this.http.post<User>(`${this.url}/users`, user).pipe();
  }

  login(user: User): Observable<User>{
    return this.http.post<User>(`${this.url}/users/Login`, user);
  } 
}