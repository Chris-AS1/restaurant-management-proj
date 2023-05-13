import moongoose, { InferSchemaType, Schema } from "mongoose";

export const foodTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true
    },
    prod_time: {
        type: Number,
        default: 0
    },
    drink: {
        type: Boolean,
        default: false,
    },
})

export type foodType = InferSchemaType<typeof foodTypeSchema>

export const foodTypeModel = moongoose.model('FoodType', foodTypeSchema)
