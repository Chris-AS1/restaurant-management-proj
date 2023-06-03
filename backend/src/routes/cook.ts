import express from "express"
import { NormalResponse } from "../models/responses/normal.response.model";
import { OrderList } from "../models/responses/orderlist.response.model";
import { startCooking, getCookingOrders, finishCooking, getWaitingOrders } from "../db/cook"
import { Roles } from "../models/user.roles.model";
import { jwtGuarding } from "../db/auth";
import { expressjwt as jwt } from 'express-jwt';
import { environment } from "../environment";

var router = express.Router();

router.use(jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }),
    jwtGuarding(Roles.COOK)
);

// Orders in the WAITING queue
router.get('/orders/waiting', function(req, res) {
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

// Get orders that are being cooked
router.get('/orders/cooking', function(req, res) {
    getCookingOrders().then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as OrderList)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error retrieving orders" } as NormalResponse)
            })
});

// Start cooking orders for a table
router.put('/orders/:table_id/start', function(req, res) {
    const table_id = parseInt(req.params.table_id)
    startCooking(table_id).then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as NormalResponse)
        }).catch(
            err => {
                console.log(err)
                res.status(400)
                res.send({ success: false, message: "Error starting cooking" } as NormalResponse)
            })
});

// Finish cooking orders for a table
router.put('/orders/:table_id/finish', function(req, res) {
    const table_id = parseInt(req.params.table_id)
    finishCooking(table_id).then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as NormalResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error finishing the order" } as NormalResponse)
            })
});

module.exports = router;
