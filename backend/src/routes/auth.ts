import express from "express"
import { genToken, getUser } from '../db/auth';
import { NormalResponse } from "../models/responses/normal.response.model";
import { LoginResponse } from "../models/responses/login.response.model";
import * as argon2 from "argon2";

var router = express.Router();

router.post('/login', async (req, res) => {
    const cur_user = await getUser(req.body.username)
    if (cur_user) {
        const hash_psw = cur_user.password
        const unk_psw = req.body.password
        try {
            if (await argon2.verify(hash_psw, unk_psw)) {
                const login_res: LoginResponse = {
                    success: true,
                    token: genToken(cur_user._id.toString(), req.body.username, cur_user.role),
                }

                res.send(login_res)
            }
        } catch (error) {
            res.status(401)
            res.send({ success: false, message: "wrong credentials" } as NormalResponse)
        }
    } else {
        res.status(401)
        res.send({ success: false, message: "user not found" } as NormalResponse)
    }
})

module.exports = router;

