import express from "express"
import { NormalResponse } from "../models/responses/normal.response.model";
import { OrderList } from "../models/responses/orderlist.response.model";
import { getUnpaidOrders, getPendingOrders, startCooking, getCookingOrders, finishCooking } from "./../mongo"

var router = express.Router();

// All orders except ones already paid
router.get('/get_orders', function(req, res) {
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

// All orders except ones already paid
router.get('/get_pending', function(req, res) {
    getPendingOrders().then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as OrderList)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error retrieving orders" } as NormalResponse)
            })
});

router.get('/cook_order/:table_id', function(req, res) {
    const table_id = parseInt(req.params.table_id)
    startCooking(table_id).then(
        data => {
            res.status(200)
            res.send({ success: true, message: data } as NormalResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error paying a receipt" } as NormalResponse)
            })
});

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

// All orders except ones already paid
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

module.exports = router;
