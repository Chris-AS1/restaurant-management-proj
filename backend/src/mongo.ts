import mongoose from 'mongoose';
import { userModel } from './schemas/user.schema';
import { User } from './models/user.model';
import { environment } from "./environment"
import { orderModel, orderType } from './schemas/order.schema';
import { foodType, foodTypeModel, foodTypeSchema } from './schemas/foodtype.schema';
import { Order } from './models/order.model';

const pino = require('pino')()

mongoose
    .connect(environment.MONGO_URL, { retryWrites: true, w: 'majority' })
    .then(() => {
        pino.info("Connected to MongoDB");
        Promise.resolve(getAllOrders()).catch(e => { pino.error(e) })
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
        order_time: Date.now()
    })

    Promise.all([CopertoType.save(),
    SpaghettiType.save(),
    WaterType.save(), TestOrder1.save()])
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

    /* for(let i = 0; i < res.length; i++) {
        pino.warn(res[i].items_info)
    } */
    return res as Order[]
}
