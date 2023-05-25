import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { User } from './models/user.model';
import { LoginResponse } from './models/login.response.model';
import { Roles } from './models/user.roles.model';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedStatus: boolean = true;
  private loggedUsername?: string;
  private loggedID?: string;

  // TO REMOVE TESTING ONLY
  private loggedRole?: Roles = Roles.WAITER;

  constructor(private http: HttpClient) { }

  get isLoggedIn() {
    return this.loggedStatus;
  }

  get currentRole() {
    return this.loggedRole;
  }

  get currentUsername() {
    return this.loggedUsername;
  }

  setLoggedIn(v: boolean) {
    this.loggedStatus = v
  }

  setUsername(username: string) {
    this.loggedUsername = username;
  }

  setRole(role: Roles) {
    this.loggedRole = role;
  }

  getUserDetails(u: User) {
    const data = { "username": u.username, "password": u.password }
    // TODO endpoint
    return this.http.post<LoginResponse>(environment.ROOT_URL + "/login", data)
  }
}
