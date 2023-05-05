import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { User } from './models/user.model';
import { Data } from './models/data.model';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedStatus = false;

  constructor(private http: HttpClient) { }

  get isLoggedIn() {
    return this.loggedStatus;
  }

  setLoggedIn(v: boolean) {
    this.loggedStatus = v
  }

  getUserDetails(u: User) {
    const data = { "username": u.username, "password": u.password  }
    return this.http.post<Data>(environment.ROOT_URL, data)
  }
}
