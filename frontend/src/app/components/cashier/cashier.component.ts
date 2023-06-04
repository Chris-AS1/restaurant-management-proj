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
import { UserListResponse } from 'src/app/models/userlist.response.model';

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
  ordersPendingMessage?: string

  ordersProcessing?: Order[]
  ordersProcessingMessage?: string

  tablesCurrent?: Table[]
  tablesMessage?: string

  usersList?: User[]
  usersListMessage?: string

  intervalRefresh: number[] = []

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refreshOrders()
    this.refreshPendingOrders()
    this.getTables()
    this.refreshUsers()
    this.refreshProcessingOrders()

    this.intervalRefresh.push(setInterval(() => this.refreshOrders(), environment.REFRESH_INTERVAL))
    this.intervalRefresh.push(setInterval(() => this.refreshPendingOrders(), environment.REFRESH_INTERVAL))
    this.intervalRefresh.push(setInterval(() => this.refreshProcessingOrders(), environment.REFRESH_INTERVAL))
    this.intervalRefresh.push(setInterval(() => this.getTables(), environment.REFRESH_INTERVAL))
    this.intervalRefresh.push(setInterval(() => this.refreshUsers(), environment.REFRESH_INTERVAL))
  }

  ngOnDestroy() {
    for (let x of this.intervalRefresh) {
      clearInterval(x)
    }
  }

  // Get list of current users
  refreshUsers() {
    this.http.get<UserListResponse>(this.roleRoute + "/user").subscribe(
      (data) => {
        if (data.success) {
          this.usersList = data.message
        } else {
          this.usersListMessage = "Error"
        }
      },
      (err) => {
        this.usersListMessage = "Error: " + err.statusText
      }
    )
  }


  // Deletes a user by username
  deleteUser(form: NgForm) {
    const username = form.value.username
    if (username) {
      this.http.delete<NormalResponse>(this.roleRoute + "/user/" + username).subscribe(
        (data) => {
          if (data.success) {
            this.usersListMessage = data.message
          } else {
            this.usersListMessage = "Error"
          }
        },
        (err) => {
          this.usersListMessage = "Error: " + err.statusText
        }
      )
    }
  }

  registerUser(form: NgForm) {
    // parseInt shouldn't be needed.
    let roleN: number | undefined
    if (form.value.role) {
      roleN = parseInt(Roles[form.value.role.toUpperCase()])
      this.registerMessage = undefined

      const u: User = {
        username: form.value.username,
        password: form.value.password,
        role: roleN
      }

      this.http.post<RegisterResponse>(this.roleRoute + "/user", { "user": u }).subscribe(
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
  }

  // Should get all orders but completed ones
  refreshOrders() {
    // this.receiptTotal = undefined
    this.receiptMessage = undefined

    this.http.get<OrderList>(this.roleRoute + "/orders/unpaid").subscribe(
      (data) => {
        // TODO sort by table
        const tables_to_pay = new Set<number>()
        for (let order of data.message) {
          tables_to_pay.add(order.table_num)
        }

        this.tablesToPay = Array.from(tables_to_pay)
        if (this.tablesToPay.length === 0) {
          this.tablesToPay = undefined
        }
      },
      (err) => {
        this.receiptMessage = "Error: " + err.statusText
      })
  }

  // Get orders waiting to be cooked, WAITING queue
  refreshPendingOrders() {
    this.http.get<OrderList>(this.roleRoute + "/orders/waiting").subscribe(
      (data) => {
        if (data.success) {
          this.ordersPending = data.message
        } else {
          this.ordersPendingMessage = "Error"
        }
      },
      (err) => {
        this.ordersPendingMessage = "Error: " + err.statusText
      }
    )
  }

  // Get orders that are being worked on, PROCESSING queue
  refreshProcessingOrders() {
    this.http.get<OrderList>(this.roleRoute + "/orders/processing").subscribe(
      (data) => {
        if (data.success) {
          this.ordersProcessing = data.message
        } else {
          this.ordersProcessingMessage = "Error"
        }
      },
      (err) => {
        this.ordersProcessingMessage = "Error: " + err.statusText
      }
    )
  }

  createReceipt(form: NgForm) {
    const table_num = form.value.table_num
    this.receiptTotal = undefined
    this.receiptMessage = undefined

    this.http.get<ReceiptResponse>(this.roleRoute + "/receipt/" + table_num).subscribe(
      (data) => {
        if (data.success) {
          this.receiptTotal = data.message
        } else {
          this.receiptMessage = "Error"
        }
      },
      (err) => {
        this.receiptMessage = "Error: " + err.statusText
      }
    )
  }

  payReceipt(table_num: number) {

    this.http.put<NormalResponse>(this.roleRoute + "/receipt/" + table_num, {}).subscribe(
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

  getTables() {
    this.tablesMessage = undefined
    // this.tablesCurrent = undefined

    this.http.get<TableList>(this.roleRoute + "/tables").subscribe(
      (data) => {
        if (data.success) {
          this.tablesCurrent = data.message
        } else {
          this.tablesMessage = "Error"
        }
      },
      (err) => {
        this.tablesMessage = "Error: " + err.statusText
      }
    )
  }

  getAvgProcessingTime() {
    this.http.get<NormalResponse>(this.roleRoute + "/averageProcessingTime").subscribe(
      (data) => {
        if (data.success) {
          this.avgTimeMessage = "The average cooking time in the kitchen is: " + data.message + " minutes"
        } else {
          this.avgTimeMessage = "Error"
        }
      },
      (err) => {
        this.avgTimeMessage = "Error: " + err.statusText
      }
    )
  }

  getDailyRevenue() {
    this.http.get<NormalResponse>(this.roleRoute + "/dailyRevenue").subscribe(
      (data) => {
        if (data.success) {
          this.revenueMessage = "Today €" + data.message + " were made in revenue"
        } else {
          this.revenueMessage = "Error"
        }
      },
      (err) => {
        this.revenueMessage = "Error: " + err.statusText
      }
    )
  }
}
