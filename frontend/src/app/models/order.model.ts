export interface Order {
  id: number,
  waitress_id: number,
  items: [Food|Drink],
  order_time: Date,
}

interface Food {
  name: string,
  price: number,
  prod_time: number,
}

interface Drink {
  name: string,
  price: number,
  prod_time: number,
}
