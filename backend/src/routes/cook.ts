import express from "express"
import { NormalResponse } from "../models/responses/normal.response.model";
import { OrderList } from "../models/responses/orderlist.response.model";
import { startCooking, getCookingOrders, finishCooking, getWaitingOrders } from "../db/cook"

var router = express.Router();

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
router.get('/get_cooking', function(req, res) {
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
router.get('/begin_order/:table_id', function(req, res) {
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
router.get('/finish_order/:table_id', function(req, res) {
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
