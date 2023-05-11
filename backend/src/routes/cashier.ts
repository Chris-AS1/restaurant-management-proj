import express from "express"
import { addUser, getUser } from "./../mongo"
import { User } from "../models/user.model";
import { RegisterResponse } from "../models/register.response.model";
var router = express.Router();

router.get('/dashboard', function(req, res) {
    res.send('Cashier Dashboard');
});

router.post('/add_user', async function(req, res) {
    const { username, password, role }: User = req.body.user
    const u: User = {
        username: username,
        password: password,
        role: role,
    };

    addUser(u).then(
        data => {
            res.status(200)
            res.send({success: true, message: JSON.stringify(data)} as RegisterResponse)
        }
    ).catch(
        err => {
            res.status(403)
            res.send({success: false, message: JSON.stringify(err)} as RegisterResponse)
        }
    )
});

router.get('/get_user/:usr', async function(req, res) {
    let a = await getUser(req.params.usr)
    res.send(JSON.stringify(a));
});

router.get('/create_receipt', function(req, res) {
    res.send('');
});

router.get('/get_pending_orders', function(req, res) {
    res.send('');
});

router.get('/get_waiters_tables', function(req, res) {
    res.send('');
});

router.get('/get_free_tables', function(req, res) {
    res.send('');
});

router.get('/get_avg_proc_time', function(req, res) {
    res.send('');
});

router.get('/get_daily_revenue', function(req, res) {
    res.send('');
});

router.get('/create_receipt', function(req, res) {
    res.send('');
});

module.exports = router;
