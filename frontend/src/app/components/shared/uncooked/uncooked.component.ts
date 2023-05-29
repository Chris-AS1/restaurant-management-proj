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

// TODO generalize this component
export class UncookedComponent {
  @Input() isCook: boolean = false
  @Input() isBart: boolean = false

  intervalRefresh?: any

  roleRoute?: string

  ordersPending?: Order[]
  ordersPendingMessage?: string

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.roleRoute = environment.ROOT_URL + (this.isCook ? "/cook" : this.isBart ? "/bartender" : "/cashier")

    this.refreshPendingOrders()
    this.intervalRefresh = setInterval(() => this.refreshPendingOrders(), environment.REFRESH_INTERVAL)
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
          if (this.isCook || this.isBart) {
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

  // Cook only, start order
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

  // Bartender only, start order
  processOrder(table_num: number) {
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
