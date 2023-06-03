import express from "express"
import { NormalResponse } from "../models/responses/normal.response.model";
import { TableList } from "../models/responses/tablelist.response.model"
import { bookTable, deliverOrder, getMenu, getReadyOrders, getTables, placeOrder } from "../db/waiter"
import { FoodList } from "../models/responses/foodlist.response.model";
import { jwtGuarding } from "../db/auth";
import { Roles } from "../models/user.roles.model";
import { environment } from "../environment";
import { expressjwt as jwt } from 'express-jwt';
import { OrderList } from "../models/responses/orderlist.response.model";

var router = express.Router();

router.use(jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }),
    jwtGuarding(Roles.WAITER)
);

router.get('/tables', function(req, res) {
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

router.post('/book/:table_num', jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }), function(req, res) {
    const table_num: number = parseInt(req.params.table_num)
    const { seats_booked } = req.body

    // @ts-ignore
    const user_id = req.auth.id

    bookTable(table_num, seats_booked, user_id).then(
        data => {
            res.status(200)
            res.send({ success: true, message: "Table " + table_num + " has been booked" } as NormalResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error booking the table" } as NormalResponse)
            })
});

router.get('/menu', function(req, res) {
    // TODO test
    getMenu().then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as FoodList)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error retrieving the menu" } as NormalResponse)
            })
});

router.post('/orders/new', function(req, res) {
    const { table_num, items } = req.body

    placeOrder(table_num, items).then(
        data => {
            res.status(200)
            res.send({ success: true, message: "Order placed" } as NormalResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error placing the order" } as NormalResponse)
            })
});

router.put('/orders/:table_id/deliver', function(req, res) {
    const table_id = parseInt(req.params.table_id)
        deliverOrder(table_id).then(
            data => {
                res.status(200)
                res.send({ success: true, message: data } as NormalResponse)
            }).catch(
                err => {
                    res.status(400)
                    res.send({ success: false, message: "Error with the order delivery" } as NormalResponse)
                })
});

// Get orders that are being cooked
router.get('/orders/ready', jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }), function(req, res) {
    // @ts-ignore
    getReadyOrders(req.auth.id).then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as OrderList)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error retrieving orders" } as NormalResponse)
            })
});

module.exports = router;
