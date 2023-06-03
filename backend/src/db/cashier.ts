import { userModel } from "../schemas/user.schema"
import { User } from "../models/user.model";
import { orderModel } from "../schemas/order.schema";
import { Order } from "../models/order.model";
import { Receipt } from "../models/receipt.model";
import { Table } from "../models/table.model";
import { tableModel } from "../schemas/table.schema";
import { processingQueueParams, waitingQueueParams } from "./params";

const pino = require('pino')()

export const addUser = async (u: User) => {
    const newUser = new userModel(u)
    await newUser.save()
    return newUser
}

export const deleteUser = async (username: string) => {
    return await userModel.deleteOne({ username: username }).exec()
}

export const getAllUsers = async () => {
    return await userModel.find({}).exec()
}

// Has to calculate total price, has to aggregate orders and set table to free
export const getReceipt = async (table_num: number) => {
    const res = await orderModel.aggregate([
        {
            "$match": {
                table_num: table_num,
                paid: false,
            },
        },
        {
            "$lookup": {
                from: "foodtypes",
                localField: "items",
                foreignField: "name",
                as: "items_info",
            },
        }]).exec()

    let total_price = 0
    let total_items = []
    for (let r of res) {
        for (let food of r.items_info) {
            total_price += food.price
            total_items.push(food.name + " (€" + food.price + ")")
        }
    }

    return {
        table_num: table_num,
        items: total_items.sort(),
        total_price: total_price
    } as Receipt
}

export const payReceipt = async (table_num: number) => {
    const table = await tableModel.findOne({ table_num: table_num }).exec()
    if (table) {
        table.occupied_seats = 0
        await table.save()
        await orderModel.updateMany({
            table_num: table_num,
            paid: false,
        }, {
            $set: {
                paid: true
            }
        }).exec()

        return "Receipt for table " + table_num + " has been paid"
    }

    throw new Error("invalid table_num")
}

export const getUnpaidOrders = async () => {
    const res = await orderModel.aggregate([
        {
            "$match": {
                paid: false,
            },
        },
        {
            "$lookup": {
                from: "foodtypes",
                localField: "items",
                foreignField: "name",
                as: "items_info"
            }
        },
    ]).exec()

    return res as Order[]
}

// Cashier Version, query for WAITING queue, both food/drinks
export const getWaitingOrders = async () => {
    // WAITING queue
    const res = await orderModel.aggregate([
        ...waitingQueueParams,
    ]).exec()

    return res as Order[]
}

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

export const getAvgProcTime = async () => {
    // PROCESSING queue
    const res = await orderModel.aggregate([
        ...processingQueueParams,
    ]).exec()

    if (res.length === 0) {
        return 0
    }

    let tot_proc_time = 0

    for (let order of res) {
        for (let food of order.items_info) {
            tot_proc_time += food.prod_time
        }
    }

    // mean by order number
    return tot_proc_time / res.length
}

export const getDailyRevenue = async () => {
    let day_profit = 0

    var start = new Date();
    var end = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // fetches paid orders made today
    const res = await orderModel.aggregate([
        {
            "$match": {
                paid: true,
                order_time: { $gte: start, $lt: end }
            },
        },
        {
            "$lookup": {
                from: "foodtypes",
                localField: "items",
                foreignField: "name",
                as: "items_info"
            }
        }]).exec()

    for (let order of res) {
        for (let food of order.items_info) {
            day_profit += food.price
        }
    }

    return day_profit
}

