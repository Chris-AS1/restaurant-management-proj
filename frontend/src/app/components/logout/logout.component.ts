import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private Auth: AuthService) { }

  ngOnInit() {
    this.Auth.setLoggedIn(false)
    this.Auth.setRole(undefined)
    this.Auth.setUsername(undefined)
    localStorage.removeItem('token')
  }
}
