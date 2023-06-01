import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Roles } from 'src/app/models/user.roles.model';
import jwt_decode from 'jwt-decode'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginMessage?: string

  constructor(private Auth: AuthService, private router: Router) { }

  loginUser(f: NgForm) {
    const username = f.value.username
    const password = f.value.password

    console.log(username, password)

    // TODO: test login
    this.Auth.getUserDetails({ username, password }).subscribe(
      (data) => {
        console.log(data);

        if (data.success) {
          this.Auth.setLoggedIn(true)
          this.Auth.setUsername(username)

          localStorage.setItem('token', data.token)
          console.log(data.token);

          // @ts-ignore
          const role = jwt_decode(data.token).role
          this.Auth.setRole(role)

          if (role in Roles) {
            this.router.navigate([Roles[role].toLowerCase()])
          } else {
            console.log("Role out of scope", role);
            this.router.navigate([''])
          }
        } else {
          this.loginMessage = data.message
          this.Auth.setLoggedIn(false)
          this.router.navigate([''])
        }
      })
  }
}
