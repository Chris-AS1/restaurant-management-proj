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
import { NormalResponse } from 'src/app/models/normal.response.model';
import { Receipt } from "../../models/receipt.model"

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent {
  roleRoute = environment.ROOT_URL + "/cashier"

  newUserPossibleRoles = ["Cashier", "Cook", "Bartender", "Waiter"]
  selectedRole?: string

  registerMessage?: string

  receiptMessage?: string
  receiptTotal?: Receipt

  avgTimeMessage?: string
  revenueMessage?: string

  ordersToPay?: Order[]
  tablesToPay?: number[]
  ordersPending?: Order[]
  currentTables?: Table[]

  constructor(private http: HttpClient) { }

  registerUser(form: NgForm) {
    // parseInt shouldn't be needed.
    let roleN: number | undefined
    if (form.value.role) {
      roleN = parseInt(Roles[form.value.role.toUpperCase()])
    }

    const u: User = {
      username: form.value.username,
      password: form.value.password,
      role: roleN
    }

    this.http.post<RegisterResponse>(this.roleRoute + "/add_user", { "user": u }).subscribe(
      (data) => {
        if (data.success) {
          this.registerMessage = data.message
          form.reset()
        } else {
          this.registerMessage = "Error"
        }
      },
      (err) => {
        this.registerMessage = "Error: " + err.statusText
      }
    )
  }

  // Should get all orders but completed ones
  refreshOrders() {
    this.http.get<OrderList>(this.roleRoute + "/get_orders/").subscribe(
      (data) => {
        // TODO sort by table
        const tables_to_pay = new Set<number>()
        for (let order of data.message) {
          tables_to_pay.add(order.table_num)
        }

        // old, used when displaying orders and not tables
        // this.ordersToPay = data.message
        this.tablesToPay = Array.from(tables_to_pay)
      },
      (err) => {
        this.receiptMessage = "Error: " + err.statusText
      })
  }

  createReceipt(form: NgForm) {
    const table_id = form.value.table_num

    this.http.get<ReceiptResponse>(this.roleRoute + "/get_receipt/" + table_id).subscribe(
      (data) => { this.receiptTotal = data.message },
      (err) => {
        this.receiptMessage = "Error: " + err.statusText
      }
    )
  }

  // Should get orders waiting to be cooked
  refreshPendingOrders() {
    // TODO endpoint
    this.http.get<OrderList>(this.roleRoute + "/get_pending/").subscribe(
      (data) => {
        if (data.success && data.message.length > 0) {
          this.ordersPending = data.message
        }
      },
    )
  }
  getTableAssociations() {
    // TODO implement API endpoint first
    // consider moving it to getTables()
  }

  getTables() {
    // TODO endpoint
    this.http.get<TableList>(this.roleRoute + "/get_tables/").subscribe(
      (data) => {
        if (data.success && data.message.length > 0) {
          this.currentTables = data.message
        }
      },
    )
  }

  getAvgProcessingTime() {
    // TODO endpoint
    this.http.get<NormalResponse>(this.roleRoute + "/get_avg_time/").subscribe(
      (data) => {
        if (data.success) {
          this.avgTimeMessage = data.message
        }
      },
    )
  }

  getDailyRevenue() {
    // TODO endpoint
    this.http.get<NormalResponse>(this.roleRoute + "/get_daily_revenue/").subscribe(
      (data) => {
        if (data.success) {
          this.revenueMessage = data.message
        }
      },
    )
  }
}
