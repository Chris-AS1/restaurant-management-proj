import mongoose, { Schema } from 'mongoose';
import { environment } from "./environment";
import { cashierSchema, cashierModel } from "./schemas/cashier.schema";

const pino = require('pino')()

/** Connect to Mongo */
mongoose
    .connect(environment.MONGO_URL, { retryWrites: true, w: 'majority' })
    .then(() => {
        pino.info("Connected to MongoDB");
    })
    .catch((error) => pino.error(error));


export const addTestCashier = () => {
    const testCashier = new cashierModel({name: "jeff"})
    testCashier.save()
}

export const showCashier = async (id: string) => {
    return await cashierModel.findById(id).exec()
}

