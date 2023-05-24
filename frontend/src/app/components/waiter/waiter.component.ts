import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Table } from 'src/app/models/table.model';
import { TableList } from 'src/app/models/tablelist.response.model';
import { environment } from 'environment';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.intervalRefresh = setInterval(() => this.getTables(), environment.REFRESH_INTERVAL)
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

}
