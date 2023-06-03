import moongoose, { InferSchemaType, Schema } from "mongoose";
import { tableModel, tableSchema } from "./table.schema";

export const orderSchema = new Schema({
    table_num: {
        type: Number,
        ref: tableModel,
        required: true,
    },
    items: {
        type: [String],
        required: true,
    },
    order_time: {
        type: Date,
        required: true
    },
    // on queue to be cooked
    pending: {
        type: Boolean,
        required: false,
        default: true,
    },
    // has left the kitchen
    completed: {
        type: Boolean,
        required: false,
        default: false,
    },
    // has been delivered to the table
    delivered: {
        type: Boolean,
        required: false,
        default: false,
    },
    // has been paid
    paid: {
        type: Boolean,
        required: true,
        default: false
    }
})

export type orderType = InferSchemaType<typeof orderSchema>

export const orderModel = moongoose.model('Order', orderSchema)
