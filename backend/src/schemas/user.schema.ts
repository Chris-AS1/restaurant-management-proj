import moongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
    username: String,
    password: String,
    role: number,
}

export const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true },
    role: { type: Number, required: true },
})

export const userModel = moongoose.model<UserInterface>('User', userSchema)

