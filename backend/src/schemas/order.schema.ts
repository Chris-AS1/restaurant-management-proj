import moongoose, { InferSchemaType, Schema } from "mongoose";

export const orderSchema = new Schema({
    table_num: {
        type: Number, 
        require: false
        // require: true
    },
    items: {
        type: [String],
        required: true,
    },
    order_time: Date
})

export type orderType = InferSchemaType<typeof orderSchema>

export const orderModel = moongoose.model('Order', orderSchema)
