import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderList } from 'src/app/models/orderlist.response.model';
import { environment } from 'environment';
import { NormalResponse } from 'src/app/models/normal.response.model';
import { aggregateOrdersByTable } from '../shared/tools/tools';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.scss']
})
export class CookComponent {
  intervalRefresh?: any
  roleRoute = environment.ROOT_URL + "/cook"

  ordersCooking?: Order[]
  ordersCookingMessage?: string

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.intervalRefresh = setInterval(() => this.refreshCookingOrders(), 1000)
  }

  ngOnDestroy() {
    clearInterval(this.intervalRefresh)
  }

  refreshCookingOrders() {
    this.ordersCookingMessage = undefined

    this.http.get<OrderList>(this.roleRoute + "/get_cooking/").subscribe(
      (data) => {
        if (data.success) {
          const agg_orders = aggregateOrdersByTable(data.message)
          this.ordersCooking = Object.values(agg_orders)
        } else {
          this.ordersCookingMessage = "Error"
        }
      },
      (err) => {
        this.ordersCookingMessage = "Error: " + err.statusText
      }
    )
  }

  finishOrder(table_num: number) {
    this.http.get<NormalResponse>(this.roleRoute + "/finish_order/" + table_num).subscribe(
      (data) => {
        this.refreshCookingOrders()
        this.ordersCookingMessage = data.message
      },
      (err) => {
        this.ordersCookingMessage = "Error: " + err.statusText
      }
    )
  }
}
