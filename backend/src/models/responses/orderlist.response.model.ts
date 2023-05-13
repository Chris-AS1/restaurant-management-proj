import { Order } from "../order.model";

export interface OrderList {
  success: boolean,
  message: Order[],
}
