import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Table } from 'src/app/models/table.model';
import { TableList } from 'src/app/models/tablelist.response.model';
import { environment } from 'environment';
import { MatDialog } from '@angular/material/dialog';
import { BookTableSeatsComponent } from '../dialogs/book-table-seats/book-table-seats.component';
import { NormalResponse } from 'src/app/models/normal.response.model';
import { FoodType, Order } from 'src/app/models/order.model';
import { FoodList } from 'src/app/models/foodlist.response.model';
import { NewOrder } from '../../models/neworder.model';
import { OrderList } from 'src/app/models/orderlist.response.model';
import { aggregateOrdersByTable } from '../shared/tools/tools';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent {
  roleRoute = environment.ROOT_URL + "/waiter"
  intervalRefresh: number[] = []

  tablesCurrent?: Table[]
  tablesMessage?: string
  tablesAvail?: Table[]
  tableSelected?: string

  menuCurrent?: FoodType[]
  menuMessage?: string
  orderMessage?: string

  currentNewOrder?: NewOrder

  ordersReady?: Order[]
  ordersReadyMessage?: string

  constructor(private http: HttpClient, public dialog: MatDialog, private Auth: AuthService) { }

  ngOnInit() {
    this.getMenu()
    this.getTables()
    this.refreshReadyOrders()

    this.intervalRefresh.push(setInterval(() => this.getTables(), environment.REFRESH_INTERVAL))
    this.intervalRefresh.push(setInterval(() => this.refreshReadyOrders(), environment.REFRESH_INTERVAL))
  }

  ngOnDestroy() {
    for (let x of this.intervalRefresh) {
      clearInterval(x)
    }
  }

  openDialog(table_num: number, max_seats: number): void {
    const dialogRef = this.dialog.open(BookTableSeatsComponent, {
      data: { seats: 1, max_seats: max_seats, table_num: table_num },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookTable(table_num, result)
      }
    });
  }

  getTables() {
    this.tablesMessage = undefined

    this.http.get<TableList>(this.roleRoute + "/tables").subscribe(
      (data) => {
        if (data.success) {
          this.tablesCurrent = data.message
          let tmpTables = []
          // TODO add id check
          for (let table of this.tablesCurrent) {
            if (table.occupied_seats > 0 && table.waiter_id === this.Auth.currentID) {
              tmpTables.push(table)
            }
          }
          this.tablesAvail = tmpTables
        } else {
          this.tablesMessage = "Error"
        }
      },
      (err) => {
        this.tablesMessage = "Error: " + err.statusText
      }
    )
  }

  getMenu() {
    this.menuMessage = undefined

    this.http.get<FoodList>(this.roleRoute + "/menu/").subscribe(
      (data) => {
        if (data.success) {
          this.menuCurrent = data.message
        } else {
          this.menuMessage = "Error"
        }
      },
      (err) => {
        this.menuMessage = "Error: " + err.statusText
      }
    )
  }

  bookTable(table_num: number, seats_booked: number) {
    this.http.post<NormalResponse>(this.roleRoute + "/book/" + table_num, { "seats_booked": seats_booked }).subscribe(
      (data) => {
        if (data.success) {
          this.tablesMessage = data.message
        } else {
          this.tablesMessage = "Error"
        }
      },
      (err) => {
        this.tablesMessage = "Error: " + err.statusText
      }
    )
  }

  addToOrder(item_name: string) {
    if (this.currentNewOrder) {
      this.currentNewOrder.items.push(item_name)
    } else {
      if (this.tableSelected) {
        this.currentNewOrder = {
          table_num: parseInt(this.tableSelected),
          "items": [item_name]
        }
      }
    }
  }

  placeOrder() {
    this.http.post<NormalResponse>(this.roleRoute + "/orders/new", this.currentNewOrder).subscribe(
      (data) => {
        if (data.success) {
          this.orderMessage = data.message
          this.tableSelected = undefined
          this.currentNewOrder = undefined
        } else {
          this.orderMessage = "Error"
        }
      },
      (err) => {
        this.orderMessage = "Error: " + err.statusText
      }
    )
  }

  deliverOrder(table_num: number) {
    this.http.put<NormalResponse>(this.roleRoute + "/orders/" + table_num + "/deliver", {}).subscribe(
      (data) => {
        if (data.success) {
          this.ordersReadyMessage = data.message
          this.ordersReady = undefined
        } else {
          this.ordersReadyMessage = "Error"
        }
      },
      (err) => {
        this.ordersReadyMessage = "Error: " + err.statusText
      }
    )
  }

  // Get orders waiting to be delivered, READY queue
  refreshReadyOrders() {
    this.http.get<OrderList>(this.roleRoute + "/orders/ready").subscribe(
      (data) => {
        if (data.success) {
          const agg_orders = aggregateOrdersByTable(data.message)
          this.ordersReady = Object.values(agg_orders)
        } else {
          this.ordersReadyMessage = "Error"
        }
      },
      (err) => {
        this.ordersReadyMessage = "Error: " + err.statusText
      }
    )
  }
}
