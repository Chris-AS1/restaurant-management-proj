export interface Order {
  _id: number,
  table_num: number,
  items: (string)[],
  order_time: Date,
  items_info?: (FoodType)[],
}

export interface FoodType {
  name: string,
  price: number,
  prod_time: number,
  drink: boolean,
}
