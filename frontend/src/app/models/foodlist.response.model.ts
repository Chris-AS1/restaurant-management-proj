import { FoodType } from "./order.model";

export interface FoodList {
  success: boolean,
  message: FoodType[],
}

