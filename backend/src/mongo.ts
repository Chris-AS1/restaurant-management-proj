import mongoose from 'mongoose';
import { userModel } from './schemas/user.schema';
import { User } from './models/user.model';
import { environment } from "./environment"
import { orderModel } from './schemas/order.schema';
import { foodTypeModel } from './schemas/foodtype.schema';
import { Order } from './models/order.model';
import { Receipt } from './models/receipt.model';

const pino = require('pino')()

mongoose
    .connect(environment.MONGO_URL, { retryWrites: true, w: 'majority' })
    .then(() => {
        pino.info("Connected to MongoDB");
        // Promise.resolve(insertDefaultValues()).catch(e => { pino.error(e) })
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

    Promise.all([CopertoType.save(),
    SpaghettiType.save(),
    WaterType.save(),
    TestOrder1.save(),
    TestOrder2.save()])
        .then(data => pino.info(data))
        .catch(e => pino.error(e))
}

export const getUser = async (username: string) => {
    return await userModel.find({ username: username }).exec()
}

export const getAllOrders = async () => {
    const res = await orderModel.aggregate().lookup({
        from: "foodtypes",
        localField: "items",
        foreignField: "name",
        as: "items_info"
    }).exec()

    return res as Order[]
}

// Has to calculate total price, has to aggregate orders and set table to free
export const getReceipt = async (table_num: number) => {
    // TODO those are completed orders
    const res = await orderModel.aggregate([
        {
            "$match": {
                table_num: table_num,
                // completed: true,
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
            total_items.push(food.name)
        }
    }

    return {
        table_num: table_num,
        items: total_items,
        total_price: total_price
    } as Receipt
}
