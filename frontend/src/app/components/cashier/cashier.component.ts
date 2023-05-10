import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'environment';
import { User } from 'src/app/models/user.model';
import { Roles } from 'src/app/models/user.roles.model';
import { RegisterResponse } from '../../models/register.response.model';
import { ReceiptResponse } from 'src/app/models/receipt.response.model';
import { OrderList } from '../../models/orderlist.response.model';
import { Order } from 'src/app/models/order.model';
import { Table } from '../../models/table.model';
import { TableList } from 'src/app/models/tablelist.response.model';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent {
  newUserPossibleRoles = ["Cashier", "Cook", "Bartender", "Waiter"];
  selectedRole?: string;
  registerMessage?: string;
  receiptMessage?: string
  ordersToPay?: Order[]
  ordersPending?: Order[]
  currentTables?: Table[]

  constructor(private http: HttpClient) { }

  registerUser(form: NgForm) {
    // parseInt shouldn't be needed.
    let roleN: number = parseInt(Roles[form.value.role.toUpperCase()])

    const u: User = {
      username: form.value.username,
      password: form.value.password,
      role: roleN
    }

    // TODO endpoint
    this.http.post<RegisterResponse>(environment.ROOT_URL + "/add_user", { "user": u }).subscribe(
      (data) => {
        if (data.success) {
          this.registerMessage = data.message
        } else {
          this.registerMessage = "error"
        }
      },
      (response) => { this.registerMessage = response.message },
    )
  }

  refreshOrders() {
    // TODO endpoint
    this.http.get<OrderList>(environment.ROOT_URL + "/get_receipt/all").subscribe(
      (data) => { this.ordersToPay = data.message },
    )
  }

  refreshPendingOrders() {
    // TODO endpoint
    this.http.get<OrderList>(environment.ROOT_URL + "/get_pending/").subscribe(
      (data) => {
        if (data.message.length > 0) {
          this.ordersPending = data.message
        }
      },
    )
  }

  createReceipt(form: NgForm) {
    const order_n = form.value.orderN

    // TODO endpoint
    this.http.get<ReceiptResponse>(environment.ROOT_URL + "/get_receipt/" + order_n).subscribe(
      (data) => { this.receiptMessage = data.message },
    )
  }

  getTableAssociations() {
    // TODO implement API endpoint first
    // consider moving it to getTables()
  }

  getTables() {
    // TODO endpoint
    this.http.get<TableList>(environment.ROOT_URL + "/get_tables/").subscribe(
      (data) => {
        if (data.success && data.message.length > 0) {
          this.currentTables = data.message
        }
      },
    )
  }
}
