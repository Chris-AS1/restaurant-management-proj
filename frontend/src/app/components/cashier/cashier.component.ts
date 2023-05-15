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

  tablesToPay?: number[]

  ordersPending?: Order[]
  ordersPendingMessage? :string

  tablesCurrent?: Table[]
  tablesMessage?: string

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
    this.receiptTotal = undefined
    this.receiptMessage = undefined

    this.http.get<OrderList>(this.roleRoute + "/get_orders/").subscribe(
      (data) => {
        // TODO sort by table
        const tables_to_pay = new Set<number>()
        for (let order of data.message) {
          tables_to_pay.add(order.table_num)
        }

        this.tablesToPay = Array.from(tables_to_pay)
      },
      (err) => {
        this.receiptMessage = "Error: " + err.statusText
      })
  }

  createReceipt(form: NgForm) {
    const table_num = form.value.table_num
    this.receiptTotal = undefined
    this.receiptMessage = undefined

    this.http.get<ReceiptResponse>(this.roleRoute + "/get_receipt/" + table_num).subscribe(
      (data) => { this.receiptTotal = data.message },
      (err) => {
        this.receiptMessage = "Error: " + err.statusText
      }
    )
  }

  payReceipt(table_num: number) {
    this.http.get<NormalResponse>(this.roleRoute + "/pay_receipt/" + table_num).subscribe(
      (data) => {
        this.refreshOrders()
        this.receiptMessage = data.message
        this.receiptTotal = undefined
      },
      (err) => {
        this.receiptMessage = "Error: " + err.statusText
      }
    )
  }

  // Get orders waiting to be cooked, WAITING queue
  refreshPendingOrders() {
    this.http.get<OrderList>(this.roleRoute + "/get_pending/").subscribe(
      (data) => {
        if (data.success) {
          this.ordersPending = data.message
        }
      },
    )
  }

  getTables() {
    this.tablesMessage = undefined
    this.tablesCurrent = undefined

    this.http.get<TableList>(this.roleRoute + "/get_tables/").subscribe(
      (data) => {
        if (data.success) {
          this.tablesCurrent = data.message
        }
      },
      (err) => {
        this.tablesMessage = "Error: " + err.statusText
      }
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
