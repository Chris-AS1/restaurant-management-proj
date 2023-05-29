import { environment } from "../environment.dev";
import { userModel } from "../schemas/user.schema";
var jwt = require("jsonwebtoken")

export const getUser = async (username: string) => {
    const res = await userModel.findOne({ username: username })
    return res
}

export const genToken = (username: string, role: number) => {
    var token = jwt.sign({
        username: username,
        role: role,
    }, environment.JWT_KEY, { expiresIn: '1h' })

    return token
}

