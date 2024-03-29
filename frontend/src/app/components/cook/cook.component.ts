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
    this.refreshCookingOrders()
    this.intervalRefresh = setInterval(() => this.refreshCookingOrders(), environment.REFRESH_INTERVAL)
  }

  ngOnDestroy() {
    clearInterval(this.intervalRefresh)
  }

  refreshCookingOrders() {
    this.ordersCookingMessage = undefined

    this.http.get<OrderList>(this.roleRoute + "/orders/cooking").subscribe(
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
    this.http.put<NormalResponse>(this.roleRoute + "/orders/" + table_num + "/finish", {}).subscribe(
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
