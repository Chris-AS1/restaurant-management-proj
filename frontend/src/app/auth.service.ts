import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { User } from './models/user.model';
import { LoginResponse } from './models/login.response.model';
import { Roles } from './models/user.roles.model';
import { environment } from 'environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedStatus: boolean = false;
  private loggedStatusBehave: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private loggedUsername?: string;
  private loggedUsernameBehave: BehaviorSubject<string|undefined> = new BehaviorSubject<string|undefined>(undefined);

  private loggedRole?: Roles;

  constructor(private http: HttpClient) { }

  get isLoggedIn() {
    return this.loggedStatus;
  }

  get isLoggedInBehave() {
    return this.loggedStatusBehave;
  }
  get currentRole() {
    return this.loggedRole;
  }

  get currentUsername() {
    return this.loggedUsername;
  }

  get currentUsernameBehave() {
    return this.loggedUsernameBehave;
  }

  setLoggedIn(v: boolean) {
    this.loggedStatus = v
    this.loggedStatusBehave.next(v)
  }

  setUsername(username?: string) {
    this.loggedUsername = username;
    this.loggedUsernameBehave.next(username)
  }

  setRole(role?: Roles) {
    this.loggedRole = role;
  }

  getUserDetails(u: User) {
    const data = { "username": u.username, "password": u.password }
    return this.http.post<LoginResponse>(environment.ROOT_URL + "/login", data)
  }
}
