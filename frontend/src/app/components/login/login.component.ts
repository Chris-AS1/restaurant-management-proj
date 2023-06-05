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

    this.Auth.getUserDetails({ username, password }).subscribe(
      (data) => {
        if (data.success) {
          localStorage.setItem('token', data.token)

          this.Auth.setLoggedIn(true)
          this.Auth.setUsername(username)

          const jwt: any = jwt_decode(data.token)
          const role = jwt.role
          const id = jwt.id

          this.Auth.setRole(role)
          this.Auth.setID(id)

          if (role in Roles) {
            this.router.navigate([Roles[role].toLowerCase()])
          } else {
            console.log("Role out of scope", role);
          }
        } else {
          this.loginMessage = "Error"
        }
      },
      (err) => {
        this.loginMessage = "Error: " + err.statusText
        localStorage.removeItem('token')

        this.Auth.setLoggedIn(false)
        this.Auth.setUsername(undefined)
        this.Auth.setRole(undefined)
        this.Auth.setID(undefined)
      })
  }
}
