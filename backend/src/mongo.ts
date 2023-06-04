import mongoose from 'mongoose';
import { environment } from "./environment"
import { orderModel } from './schemas/order.schema';
import { foodTypeModel } from './schemas/foodtype.schema';
import { tableModel } from './schemas/table.schema';
import { userModel } from './schemas/user.schema';

const pino = require('pino')()

mongoose
    .connect(environment.MONGO_URL, { retryWrites: true, w: 'majority' })
    .then(() => {
        pino.info("Connected to MongoDB");
        // Promise.resolve(insertDefaultValues()).catch(e => { pino.error(e) })
    })
    .catch((error) => pino.error(error));

const insertDefaultValues = async () => {
    // Insert the Manu
    const CopertoType = new foodTypeModel({
        name: "Coperto",
        price: 1.5,
    })

    const SpaghettiType = new foodTypeModel({
        name: "Spaghetti",
        price: 10,
        prod_time: 10,
    })

    const PizzaType = new foodTypeModel({
        name: "Pizza",
        price: 7,
        prod_time: 7,
    })

    const WaterType = new foodTypeModel({
        name: "Acqua",
        price: 2,
        drink: true
    })

    const CocaColaType = new foodTypeModel({
        name: "CocaCola",
        price: 4,
        drink: true
    })

    const DrinkOrder1 = new orderModel({
        items: [WaterType.name, CocaColaType.name],
        table_num: 23,
        order_time: Date.now()
    })

    const DrinkOrder2 = new orderModel({
        items: [WaterType.name],
        table_num: 42,
        order_time: Date.now()
    })

    const FoodOrder1 = new orderModel({
        items: [SpaghettiType.name, PizzaType.name, CopertoType.name],
        table_num: 42,
        order_time: Date.now()
    })

    // Insert Tables
    const Table23 = new tableModel({
        table_num: 23,
        seats: 10,
    })

    const Table42 = new tableModel({
        table_num: 42,
        seats: 10,
    })

    // Insert Default Users
    const CashierUser = new userModel({
        username: "cashier",
        password: "asd",
        role: 1,
    })

    const CookUser = new userModel({
        username: "cook",
        password: "asd",
        role: 2,
    })
    const BartenderUser = new userModel({
        username: "bartender",
        password: "asd",
        role: 3,
    })
    const WaiterUser = new userModel({
        username: "waiter",
        password: "asd",
        role: 4,
    })

    Promise.all([CopertoType.save(),
    SpaghettiType.save(),
    PizzaType.save(),
    WaterType.save(),
    CocaColaType.save(),
    CashierUser.save(),
    CookUser.save(),
    BartenderUser.save(),
    WaiterUser.save(),
    Table23.save(),
    Table42.save()])
        .then(data => pino.info(data))
        .catch(e => pino.error(e))
}

