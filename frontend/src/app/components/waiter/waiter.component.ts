import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Table } from 'src/app/models/table.model';
import { TableList } from 'src/app/models/tablelist.response.model';
import { environment } from 'environment';
import { MatDialog } from '@angular/material/dialog';
import { BookTableSeatsComponent } from '../dialogs/book-table-seats/book-table-seats.component';

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

  selectedSeats?: number

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
    this.intervalRefresh = setInterval(() => this.getTables(), environment.REFRESH_INTERVAL)
  }

  openDialog(table_num: number, max_seats: number): void {
    const dialogRef = this.dialog.open(BookTableSeatsComponent, {
      data: { seats: this.selectedSeats, max_seats: max_seats, table_num: table_num },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.selectedSeats = result;
      if (this.selectedSeats) {
        this.bookTable(table_num)
      }
    });
  }

  getTables() {
    this.tablesMessage = undefined

    this.http.get<TableList>(this.roleRoute + "/get_tables/").subscribe(
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

  bookTable(table_num: number) {
    // TODO endpoint, post with seats
    this.http.get<TableList>(this.roleRoute + "/book_table/" + table_num).subscribe(
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
}
