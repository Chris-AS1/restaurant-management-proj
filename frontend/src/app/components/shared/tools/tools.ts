import { Order } from "src/app/models/order.model";

export function aggregateOrdersByTable(orders: Order[]) {
  let agg_orders: { [num: number]: Order } = {}

  orders.sort(function(a: Order, b: Order) {
    return new Date(b.order_time).getTime() - new Date(a.order_time).getTime();
  });

  for (let o of orders) {
    if (o.table_num in agg_orders) {
      agg_orders[o.table_num].items.push(...o.items)

      if (o.items_info) {
        agg_orders[o.table_num].items_info!.push(...o.items_info)
      }
    } else {
      agg_orders[o.table_num] = {
        _id: o._id,
        table_num: o.table_num,
        items: o.items,
        order_time: o.order_time,
        items_info: o.items_info || []
      } as Order
    }
  }

  return agg_orders
}
