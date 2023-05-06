import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Roles } from 'src/app/models/user.roles.model';

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

    this.Auth.getUserDetails({ username, password }).subscribe(data => {
      if (data.success) {
        this.Auth.setLoggedIn(true)
        this.Auth.setUsername(username)
        this.Auth.setRole(data.role)

        if (data.role in Roles) {
          this.router.navigate([Roles[data.role].toLowerCase()])
        } else {
          console.log("Role out of scope", data.role);
          this.router.navigate([''])
        }
      } else {
        this.Auth.setLoggedIn(false)
        this.router.navigate([''])
      }
    })
  }
}
