import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from 'src/app/models/order.model';
import { OrderList } from 'src/app/models/orderlist.response.model';
import { environment } from 'environment';
import { NormalResponse } from 'src/app/models/normal.response.model';
import { aggregateOrdersByTable } from '../shared/tools/tools';

@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.component.html',
  styleUrls: ['./bartender.component.scss']
})
export class BartenderComponent {
  intervalRefresh?: any
  roleRoute = environment.ROOT_URL + "/bartender"

  ordersProcessing?: Order[]
  ordersProcessingMessage?: string

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refreshProcessingOrders()
    this.intervalRefresh = setInterval(() => this.refreshProcessingOrders(), environment.REFRESH_INTERVAL)
  }

  ngOnDestroy() {
    clearInterval(this.intervalRefresh)
  }

  refreshProcessingOrders() {
    this.ordersProcessingMessage = undefined

    this.http.get<OrderList>(this.roleRoute + "/get_processing/").subscribe(
      (data) => {
        if (data.success) {
          const agg_orders = aggregateOrdersByTable(data.message)
          this.ordersProcessing = Object.values(agg_orders)
        } else {
          this.ordersProcessingMessage = "Error"
        }
      },
      (err) => {
        this.ordersProcessingMessage = "Error: " + err.statusText
      }
    )
  }

  finishOrder(table_num: number) {
    this.http.get<NormalResponse>(this.roleRoute + "/finish_order/" + table_num).subscribe(
      (data) => {
        this.refreshProcessingOrders()
        this.ordersProcessingMessage = data.message
      },
      (err) => {
        this.ordersProcessingMessage = "Error: " + err.statusText
      }
    )
  }
}
