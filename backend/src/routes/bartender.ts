import express from "express"
import { NormalResponse } from "../models/responses/normal.response.model";
import { OrderList } from "../models/responses/orderlist.response.model";
import { finishProcessing, getProcessingOrders, getWaitingOrders, startProcessing } from "../db/bartender";
import { expressjwt as jwt } from 'express-jwt';
import { environment } from "../environment";
import { jwtGuarding } from "../db/auth";
import { Roles } from "../models/user.roles.model";

var router = express.Router();

router.use(jwt({ secret: environment.JWT_KEY, algorithms: ["HS256"] }),
    jwtGuarding(Roles.BARTENDER)
);

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

// Get orders that are being cooked
router.get('/get_processing', function(req, res) {
    getProcessingOrders().then(
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
router.get('/begin_order/:table_id', function(req, res) {
    const table_id = parseInt(req.params.table_id)
    startProcessing(table_id).then(
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
router.get('/finish_order/:table_id', function(req, res) {
    const table_id = parseInt(req.params.table_id)
    finishProcessing(table_id).then(
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

