import express from "express"
import { User } from "../models/user.model";
import { NormalResponse } from "../models/responses/normal.response.model";
import { RegisterResponse } from "../models/responses/register.response.model";
import { OrderList } from "../models/responses/orderlist.response.model";
import { ReceiptResponse } from "../models/responses/receipt.response";
import { TableList } from "../models/responses/tablelist.response.model"
import { addUser, getUser, getReceipt, payReceipt, getWaitingOrders, getUnpaidOrders, getTables, getAvgProcTime, getDailyRevenue } from "../db/cashier"
import { environment } from "../environment";
import { expressjwt as jwt } from 'express-jwt';
import { Roles } from "../models/user.roles.model";
import { jwtGuarding } from "../db/auth";

var router = express.Router();

router.use(jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }),
    jwtGuarding(Roles.CASHIER)
);

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
            res.send({ success: true, message: "Added user " + data.username} as RegisterResponse)
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
router.get('/get_unpaid', function(req, res) {
    getUnpaidOrders().then(
        data => {
            res.status(200)
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

// Orders in the WAITING queue
router.get('/get_waiting', function(req, res) {
    getWaitingOrders().then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as OrderList)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error retrieving orders" } as NormalResponse)
            })
});


router.get('/get_tables', function(req, res) {
    getTables().then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as TableList)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error retrieving tables" } as NormalResponse)
            })
});

router.get('/get_avg_time', function(req, res) {
    getAvgProcTime().then(
        data => {
            res.status(200)
            res.send({ success: true, message: Math.floor(data).toString() } as NormalResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error retrieving mean time" } as NormalResponse)
            })
});

router.get('/get_daily_revenue', function(req, res) {
    // TODO finish implementation
    getDailyRevenue().then(
        data => {
            res.status(200)
            res.send({ success: true, message: Math.floor(data).toString() } as NormalResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error retrieving mean time" } as NormalResponse)
            })
});

module.exports = router;
