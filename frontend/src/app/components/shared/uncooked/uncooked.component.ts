import { Component, Input } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderList } from 'src/app/models/orderlist.response.model';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { NormalResponse } from 'src/app/models/normal.response.model';
import { aggregateOrdersByTable } from '../tools/tools';

@Component({
  selector: 'app-uncooked',
  templateUrl: './uncooked.component.html',
  styleUrls: ['./uncooked.component.scss']
})
export class UncookedComponent {
  @Input() isCook: boolean = false
  intervalRefresh?: any

  roleRoute = environment.ROOT_URL + "/cook"

  ordersPending?: Order[]
  ordersPendingMessage?: string

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.intervalRefresh = setInterval(() => this.refreshPendingOrders(), 1000)
  }

  ngOnDestroy() {
    clearInterval(this.intervalRefresh)
  }

  // Get orders waiting to be cooked, WAITING queue
  refreshPendingOrders() {
    this.ordersPendingMessage = undefined

    this.http.get<OrderList>(this.roleRoute + "/get_waiting/").subscribe(
      (data) => {
        if (data.success) {
          if (this.isCook) {
            const agg_orders = aggregateOrdersByTable(data.message)
            this.ordersPending = Object.values(agg_orders)
          } else {
            // cashier only
            this.ordersPending = data.message
          }
        } else {
          this.ordersPendingMessage = "Error"
        }
      },
      (err) => {
        this.ordersPendingMessage = "Error: " + err.statusText
      }
    )
  }

  cookOrder(table_num: number) {
    this.http.get<NormalResponse>(this.roleRoute + "/begin_order/" + table_num).subscribe(
      (data) => {
        this.ordersPendingMessage = data.message;
        this.refreshPendingOrders()
      },
      (err) => {
        this.ordersPendingMessage = "Error: " + err.statusText
      }
    )
  }
}
