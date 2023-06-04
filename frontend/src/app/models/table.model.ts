import { User } from "./user.model"

export interface Table {
    table_num: number,
    waiter_id: string,
    seats: number,
    occupied_seats: number,
    waiter_info?: User[]
}
