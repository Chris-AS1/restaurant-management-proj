import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Roles } from 'src/app/models/user.roles.model';
import jwt_decode from 'jwt-decode'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isLoggedIn: boolean = true

  constructor(private Auth: AuthService, private router: Router) {
    Auth.isLoggedInBehave.subscribe(val => {
      this.isLoggedIn = val
    })
  }

  ngOnInit() {
    // Loads previous session if there is a token
    // @ts-ignore
    const jwt: any = jwt_decode(localStorage.getItem('token'))
    const role = jwt.role
    const username = jwt.username

    if (role in Roles) {
      this.Auth.setRole(role)
      this.Auth.setLoggedIn(true)
      this.Auth.setUsername(username)
      this.router.navigate([Roles[role].toLowerCase()])
    }
  }
}
