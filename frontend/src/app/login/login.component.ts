import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {Data} from "../models/data.model";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private Auth: AuthService, private router: Router) { }

  loginUser(f: NgForm) {
    const username = f.value.username
    const password = f.value.password

    console.log(username, password)

    this.Auth.getUserDetails({username, password}).subscribe(data => {
      if(true) {
      // if(data.success) {
        this.Auth.setLoggedIn(true)
        this.router.navigate(['cashier'])
      } else {
        this.router.navigate([''])
      }
    })
  }
}
