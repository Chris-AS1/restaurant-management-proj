import mongoose from 'mongoose';
import { environment } from "./environment"
import { orderModel } from './schemas/order.schema';
import { foodTypeModel } from './schemas/foodtype.schema';
import { tableModel } from './schemas/table.schema';

const pino = require('pino')()

mongoose
    .connect(environment.MONGO_URL, { retryWrites: true, w: 'majority' })
    .then(() => {
        pino.info("Connected to MongoDB");
        Promise.resolve(insertDefaultValues()).catch(e => { pino.error(e) })
    })
    .catch((error) => pino.error(error));

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

    const FoodOrder1 = new orderModel({
        items: [SpaghettiType.name, PizzaType.name, CopertoType.name],
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
    PizzaType.save(),
    WaterType.save(),
    CocaColaType.save(),
    FoodOrder1.save(),
    DrinkOrder1.save(),
    Table23.save(),
    Table42.save()])
        .then(data => pino.info(data))
        .catch(e => pino.error(e))
}

