import { FoodType } from "../models/order.model"
import { Table } from "../models/table.model"
import { foodTypeModel } from "../schemas/foodtype.schema"
import { orderModel } from "../schemas/order.schema"
import { tableModel } from "../schemas/table.schema"

const pino = require('pino')()

export const getTables = async () => {
    const res = await tableModel.aggregate([
        {
            "$lookup": {
                from: "users",
                localField: "waiter_id",
                foreignField: "_id",
                as: "waiter_info"
            }
        }
    ]).exec()

    return res as Table[]
}

export const getMenu = async () => {
    const res = await foodTypeModel.find({}).exec()

    return res as FoodType[]
}

export const bookTable = async (table_num: number, occupied_seats: number, waiter_id: any) => {
    const res = await tableModel.findOneAndUpdate({ table_num: table_num }, {
        occupied_seats: occupied_seats,
        waiter_id: waiter_id
    })
}

export const placeOrder = async (table_num: number, items: string[]) => {
    const newOrder = await new orderModel({
        table_num: table_num,
        items: items,
        order_time: Date.now(),
        paid: false,
    }).save()
}
