import mongoose from 'mongoose';
import { environment } from "./environment"
import { foodTypeModel } from './schemas/foodtype.schema';
import { tableModel } from './schemas/table.schema';
import { addUser } from './db/cashier';

const pino = require('pino')()

mongoose
    .connect(environment.MONGO_URL, { retryWrites: true, w: 'majority' })
    .then(() => {
        pino.info("Connected to MongoDB");
        Promise.resolve(insertDefaultValues()).catch(e => { pino.error(e) })
    })
    .catch((error) => pino.error(error));

const insertDefaultValues = async () => {
    // Insert the Menu
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

    // Insert Tables
    const Table23 = new tableModel({
        table_num: 23,
        seats: 10,
    })

    const Table42 = new tableModel({
        table_num: 42,
        seats: 10,
    })

    try {
        // Insert Default Users
        await addUser({
            username: "cashier",
            password: "asd",
            role: 1,
        })

        await addUser({
            username: "cook",
            password: "asd",
            role: 2,
        })

        await addUser({
            username: "bartender",
            password: "asd",
            role: 3,
        })

        await addUser({
            username: "waiter",
            password: "asd",
            role: 4,
        })
    } catch (error) {
        pino.error(error)
    }

    Promise.all([CopertoType.save(),
    SpaghettiType.save(),
    PizzaType.save(),
    WaterType.save(),
    CocaColaType.save(),
    Table23.save(),
    Table42.save()])
        .then(data => pino.info(data))
        .catch(e => pino.error(e))
}

