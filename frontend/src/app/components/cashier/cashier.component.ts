import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'environment.prod';
import { User } from 'src/app/models/user.model';
import { Roles } from 'src/app/models/user.roles.model';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent {
  newUserPossibleRoles = ["Cashier", "Cook", "Bartender", "Waiter"];
  selectedRole: string | undefined;

  constructor(private http: HttpClient) { }

  registerUser(form: NgForm) {
    // parseInt shouldn't be needed.
    let a: number = parseInt(Roles[form.value.role.toUpperCase()])

     const u: User = {
      username: form.value.username,
      password: form.value.password,
      role: a
    }

    this.http.post(environment.ROOT_URL, {"user": u})
  }
}
