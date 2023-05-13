import moongoose, {InferSchemaType, Schema } from "mongoose";

export const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true },
    role: { type: Number, required: true },
})

export type userType = InferSchemaType<typeof userSchema>

export const userModel = moongoose.model('User', userSchema)

