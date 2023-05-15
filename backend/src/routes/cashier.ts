import express from "express"
import { addUser, getUser, getReceipt, payReceipt, getUnpaidOrders } from "./../mongo"
import { User } from "../models/user.model";
import { NormalResponse } from "../models/responses/normal.response.model";
import { RegisterResponse } from "../models/responses/register.response.model";
import { OrderList } from "../models/responses/orderlist.response.model";
import { ReceiptResponse } from "../models/responses/receipt.response";

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
    }

    // TODO encrypt password
    addUser(u).then(
        data => {
            res.status(200)
            res.send({ success: true, message: JSON.stringify(data) } as RegisterResponse)
        }
    ).catch(
        err => {
            res.status(400)
            res.send({ success: false, message: "Error creating user" } as RegisterResponse)
        }
    )
});

router.get('/get_user/:usr', async function(req, res) {
    getUser(req.params.usr).then(
        data => {
            res.status(200)
            res.send({ success: true, message: JSON.stringify(data) } as NormalResponse)
        }).catch(
            err => {
                res.status(403)
                res.send({ success: false, message: "Error retrieving users" } as NormalResponse)
            })
});

// All orders except ones already paid
router.get('/get_orders', function(req, res) {
    getUnpaidOrders().then(
        data => {
            res.status(200)
            // TODO consider convertin Date to timestamp
            res.send({ success: true, message: data } as OrderList)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error retrieving orders" } as NormalResponse)
            })
});

router.get('/get_receipt/:table_id', function(req, res) {
    const table_id = parseInt(req.params.table_id)
    getReceipt(table_id).then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as ReceiptResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error creating a receipt" } as NormalResponse)
            })

});

router.get('/pay_receipt/:table_id', function(req, res) {
    const table_id = parseInt(req.params.table_id)
    payReceipt(table_id).then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as NormalResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error paying a receipt" } as NormalResponse)
            })
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

module.exports = router;
