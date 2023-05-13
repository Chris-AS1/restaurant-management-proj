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
    /* pending: Boolean,
    completed: Boolean, */
})

export type orderType = InferSchemaType<typeof orderSchema>

export const orderModel = moongoose.model('Order', orderSchema)
