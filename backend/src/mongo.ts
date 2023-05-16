import mongoose from 'mongoose';
import { userModel } from './schemas/user.schema';
import { User } from './models/user.model';
import { environment } from "./environment"
import { orderModel } from './schemas/order.schema';
import { foodTypeModel } from './schemas/foodtype.schema';
import { Order } from './models/order.model';
import { Receipt } from './models/receipt.model';
import { Table } from "./models/table.model"
import { tableModel } from './schemas/table.schema';

const pino = require('pino')()

mongoose
    .connect(environment.MONGO_URL, { retryWrites: true, w: 'majority' })
    .then(() => {
        pino.info("Connected to MongoDB");
        Promise.resolve(insertDefaultValues()).catch(e => { pino.error(e) })
    })
    .catch((error) => pino.error(error));

export const addUser = async (u: User) => {
    const newUser = new userModel(u)
    return newUser.save()
}

const insertDefaultValues = async () => {
    const CopertoType = new foodTypeModel({
        name: "Coperto",
        price: 1.5,
    })

    const SpaghettiType = new foodTypeModel({
        name: "Spaghetti",
        price: 10,
        prod_time: 10,
    })

    const WaterType = new foodTypeModel({
        name: "Acqua",
        price: 2,
        drink: true
    })

    // const SpaghettiGet = await foodTypeModel.findOne({ name: "Spaghetti" }).exec()
    const TestOrder1 = new orderModel({
        items: ["Acqua", CopertoType.name],
        table_num: 23,
        order_time: Date.now()
    })

    const TestOrder2 = new orderModel({
        items: ["Spaghetti", "Spaghetti", CopertoType.name],
        table_num: 42,
        order_time: Date.now()
    })

    const Table23 = new tableModel({
        table_num: 23,
        waiter_id: -1,
        seats: 10,
    })

    const Table42 = new tableModel({
        table_num: 42,
        waiter_id: -1,
        seats: 10,
        occupied_seats: 4,
    })

    Promise.all([CopertoType.save(),
    SpaghettiType.save(),
    WaterType.save(),
    TestOrder1.save(),
    TestOrder2.save(),
    Table23.save(),
    Table42.save()])
        .then(data => pino.info(data))
        .catch(e => pino.error(e))
}

export const getUser = async (username: string) => {
    return await userModel.find({ username: username }).exec()
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
        }]).exec()

    return res as Order[]
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

export const getPendingOrders = async () => {
    const res = await orderModel.aggregate([
        {
            "$match": {
                pending: true
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

    return res as Order[]
}

export const getTables = async () => {
    // TODO double check
    const res = await tableModel.aggregate([
        {
            "$lookup": {
                from: "users",
                localField: "waiter_id",
                foreignField: "_id",
                as: "waiter_info"
            }
        }
    ])
    pino.info("tables + waiters: ")
    pino.info(res)
    return res as Table[]
}

export const getAvgProcTime = async () => {
    // fetches the PROCESSING queue
    const res = await orderModel.aggregate([
        {
            "$match": {
                pending: false,
                completed: false,
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
