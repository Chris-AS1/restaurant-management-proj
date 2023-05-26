import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Table } from 'src/app/models/table.model';
import { TableList } from 'src/app/models/tablelist.response.model';
import { environment } from 'environment';
import { MatDialog } from '@angular/material/dialog';
import { BookTableSeatsComponent } from '../dialogs/book-table-seats/book-table-seats.component';
import { NormalResponse } from 'src/app/models/normal.response.model';
import { FoodType } from 'src/app/models/order.model';
import { FoodList } from 'src/app/models/foodlist.response.model';
import { NewOrder } from '../../models/neworder.model';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent {
  roleRoute = environment.ROOT_URL + "/waiter"
  intervalRefresh?: any

  tablesCurrent?: Table[]
  tablesMessage?: string
  tablesAvail?: Table[]
  tableSelected?: string

  menuCurrent?: FoodType[]
  menuMessage?: string

  currentNewOrder?: NewOrder

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
    this.intervalRefresh = setInterval(() => this.getTables(), environment.REFRESH_INTERVAL)
    this.getMenu()
  }

  openDialog(table_num: number, max_seats: number): void {
    const dialogRef = this.dialog.open(BookTableSeatsComponent, {
      data: { seats: 1, max_seats: max_seats, table_num: table_num },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        this.bookTable(table_num, result)
      }
    });
  }

  getTables() {
    this.tablesMessage = undefined

    this.http.get<TableList>(this.roleRoute + "/get_tables/").subscribe(
      (data) => {
        if (data.success) {
          this.tablesCurrent = data.message
          let tmpTables = []
          for (let table of this.tablesCurrent) {
            if (table.occupied_seats > 0) {
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

    this.http.get<FoodList>(this.roleRoute + "/get_menu/").subscribe(
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
    // TODO endpoint, post with seats
    // TODO test
    this.http.post<NormalResponse>(this.roleRoute + "/book_table/" + table_num, { "seats_booked": seats_booked }).subscribe(
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
    // TODO test
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
    console.log(this.currentNewOrder, this.tableSelected);
  }

  sendOrder() {
    // TODO test
    this.http.post<NormalResponse>(this.roleRoute + "/place_order/", this.currentNewOrder).subscribe(
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
}
