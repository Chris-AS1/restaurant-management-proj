import moongoose, { InferSchemaType, Schema } from "mongoose";

export const tableSchema = new Schema({
    table_num: {
        type: Number,
        unique: true,
        required: true,
    },
    waiter_id: {
        type: Schema.Types.ObjectId,
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

export const tableModel = moongoose.model('Table', tableSchema)

