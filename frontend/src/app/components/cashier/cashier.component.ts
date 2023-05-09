import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'environment';
import { User } from 'src/app/models/user.model';
import { Roles } from 'src/app/models/user.roles.model';
import { RegisterResponse } from '../../models/register.response.model';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent {
  newUserPossibleRoles = ["Cashier", "Cook", "Bartender", "Waiter"];
  selectedRole: string | undefined;
  responseMessage: string | undefined;

  constructor(private http: HttpClient) { }

  registerUser(form: NgForm) {
    // parseInt shouldn't be needed.
    let roleN: number = parseInt(Roles[form.value.role.toUpperCase()])

    const u: User = {
      username: form.value.username,
      password: form.value.password,
      role: roleN
    }

    this.http.post<RegisterResponse>(environment.ROOT_URL + "/add_user", { "user": u }).subscribe(
      (data) => { this.responseMessage = data.message },
      (response) => { this.responseMessage = response.message },
    )
  }
}
