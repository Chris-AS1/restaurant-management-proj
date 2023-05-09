import mongoose, { Schema } from 'mongoose';
import { environment } from "./environment";
import { cashierSchema, cashierModel, cashierInterface } from "./schemas/cashier.schema";
import { Cashier } from './models/cashier.model';

const pino = require('pino')()

/** Connect to Mongo */
mongoose
    .connect(environment.MONGO_URL, { retryWrites: true, w: 'majority' })
    .then(() => {
        pino.info("Connected to MongoDB");
    })
    .catch((error) => pino.error(error));


export const addTestCashier = (u: Cashier) => {
    const testCashier = new cashierModel(u)
    testCashier.save()
}

export const showCashier = async (id: string) => {
    return await cashierModel.findById(id).exec()
}

