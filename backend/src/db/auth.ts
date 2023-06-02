import { environment } from "../environment.dev";
import { Roles } from "../models/user.roles.model";
import { userModel } from "../schemas/user.schema";

var jwt = require("jsonwebtoken")

const pino = require('pino')()

export const getUser = async (username: string) => {
    const res = await userModel.findOne({ username: username })
    return res
}

export const genToken = (id: string, username: string, role: number) => {
    var token = jwt.sign({
        id: id,
        username: username,
        role: role,
    }, environment.JWT_KEY, { expiresIn: '1h' })

    return token
}

export const jwtGuarding = (role: Roles) => {
    return function(req: any, res: any, next: any) {
        if (!req.auth || req.auth.role != role) {
            pino.warn(req.auth, 'Unauthorized JWT on route %s', Roles[role]);

            res.status(401)
            res.send({ success: false, message: "Unauthorized" })
        } else {
            next()
        }
    }
}
