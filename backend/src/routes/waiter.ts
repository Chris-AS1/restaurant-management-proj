import express from "express"
import { NormalResponse } from "../models/responses/normal.response.model";
import { TableList } from "../models/responses/tablelist.response.model"
import { getMenu, getTables, placeOrder } from "../db/waiter"
import { FoodList } from "../models/responses/foodlist.response.model";
import { jwtGuarding } from "../db/auth";
import { Roles } from "../models/user.roles.model";
import { environment } from "../environment";
import { expressjwt as jwt } from 'express-jwt';

var router = express.Router();

router.use(jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }),
    jwtGuarding(Roles.WAITER)
);

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

router.post('/book_table/:table_num', function(req, res) {
    const table_num: number = parseInt(req.params.table_num)
    const { seats_booked } = req.body

    res.send({ success: false, message: "Error booking the table" } as NormalResponse)

    // TODO add JWT
    /* const jwt_token = req.headers.authorization

    bookTable(table_num, seats_booked, null).then(
        data => {
            res.status(200)
            res.send({ success: true, message: "Table " + table_num + " has been booked" } as NormalResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error booking the table" } as NormalResponse)
            }) */
});

router.get('/get_menu', function(req, res) {
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

router.post('/place_order/', function(req, res) {
    // TODO test
    const { table_num, items } = req.body

    placeOrder(table_num, items).then(
        data => {
            res.status(200)
            res.send({ success: true, message: "Order placed" })
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error placing the order" } as NormalResponse)
            })
});

module.exports = router;
