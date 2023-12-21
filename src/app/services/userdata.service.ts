import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  private userData: User = {
    id: null,
    productId: '',
    userName: null,
    password: null,
    isAdmin: null
  };

  constructor() { }

  setUser(data: User): void {
    this.userData = { ...data };
  }

  getUser(): User {
    return { ...this.userData };
  }

  deleteUser(): void {
    this.userData = {
      id: null,
      productId: '',
      userName: null,
      password: null,
      isAdmin: null
    };
  }
}

