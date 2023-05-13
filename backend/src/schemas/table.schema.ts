import moongoose, { InferSchemaType, Schema } from "mongoose";

export const tableSchema = new Schema({
    waiter_id: {
        type: Number,
        required: true,
    },
    seats: {
        type: Number,
        required: true
    },
    occupied_seats: {
        type: Number,
        required: false,
        default: 0,
    }
})

export type tableType = InferSchemaType<typeof tableSchema>

export const userModel = moongoose.model('Table', tableSchema)

