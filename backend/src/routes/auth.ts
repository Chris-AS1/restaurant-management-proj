import express from "express"
import { genToken, getUser } from '../db/auth';
import { NormalResponse } from "../models/responses/normal.response.model";
import { LoginResponse } from "../models/responses/login.response.model";

var router = express.Router();

router.post('/login', async (req, res) => {
    // TODO encrypt password, verify password
    const cur_user = await getUser(req.body.username)
    if (cur_user) {
        const hash_psw = cur_user.password
        const unk_psw = req.body.password // TODO hash
        if (hash_psw === unk_psw) {
            const login_res: LoginResponse = {
                success: true,
                token: genToken(req.body.username, cur_user.role),
            }

            res.send(login_res)
        }
    } else {
        res.status(401)
        res.send({ success: false, message: "Wrong credentials" } as NormalResponse)
    }
})

module.exports = router;

