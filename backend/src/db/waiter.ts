import { log } from "console"
import { FoodType, Order } from "../models/order.model"
import { Table } from "../models/table.model"
import { foodTypeModel } from "../schemas/foodtype.schema"
import { orderModel } from "../schemas/order.schema"
import { tableModel } from "../schemas/table.schema"
import { undeliveredQueueParams, waitingQueueParams } from "./params"
import mongoose from "mongoose"

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
    const table = await tableModel.findOne({ table_num: table_num }).exec()
    if (table) {
        table.occupied_seats = Math.min(occupied_seats, table.seats)
        table.waiter_id = waiter_id
        await table.save()
    }
}

export const placeOrder = async (table_num: number, items: string[]) => {
    const menu = await foodTypeModel.find({}).exec()
    let new_items = []
    let menu_dict: any = {}

    for(let f of menu) {
        menu_dict[f.name] = f
    }

    for(let i = 0; i < items.length; i++) {
        new_items[i] = menu_dict[items[i]]
    }

    const drinks = new_items.filter(i => i.drink)
    const foods = new_items.filter(i => !i.drink)
    
    await new orderModel({
        table_num: table_num,
        items: drinks.map(i => i.name),
        order_time: Date.now(),
        paid: false,
    }).save()

    await new orderModel({
        table_num: table_num,
        items: foods.map(i => i.name),
        order_time: Date.now(),
        paid: false,
    }).save()
}

export const deliverOrder = async (table_num: number) => {
    if (table_num === undefined) throw new Error("invalid table_num")

    await orderModel.updateMany({
        completed: true,
        delivered: false,
        table_num: table_num
    }, {
        delivered: true
    }).exec()

    return "Orders on table " + table_num + " have been delivered"
}

// Waiter Version, query for READY queue, both food/drinks
export const getReadyOrders = async (user_id: string) => {
    const res = await orderModel.aggregate([
        ...undeliveredQueueParams,
        {
            "$match": {
                tables_info: {
                    $elemMatch: {
                        waiter_id: new mongoose.Types.ObjectId(user_id),
                    }
                }
            }
        }
    ]).exec()
    return res as Order[]
}

