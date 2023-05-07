import moongoose, { Document, Schema } from "mongoose";

export interface cashierInterface extends Document {
    name: String;
}

export const cashierSchema = new Schema({
    name: { type: String, required: false },
})

export const cashierModel = moongoose.model<cashierInterface>('Cashier', cashierSchema)
