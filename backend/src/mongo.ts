import mongoose from 'mongoose';
import { userModel } from './schemas/user.schema';
import { User } from './models/user.model';
import { environment } from "./environment"

const pino = require('pino')()

mongoose
    .connect(environment.MONGO_URL, { retryWrites: true, w: 'majority' })
    .then(() => {
        pino.info("Connected to MongoDB");
    })
    .catch((error) => pino.error(error));

export const addUser = async (u: User) => {
    pino.error(u)

    const newUser = new userModel(u)

    return newUser.save()
}

export const getUser = async (username: string) => {
    const a = await userModel.find({ username: username }).exec()
    pino.info("returned from mongo: " + a)
}

