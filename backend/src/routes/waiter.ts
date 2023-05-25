import express from "express"
import { NormalResponse } from "../models/responses/normal.response.model";
import { TableList } from "../models/responses/tablelist.response.model"
import { bookTable, getTables } from "../db/waiter"

var router = express.Router();

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
    // TODO add JWT
    const jwt_token = req.headers.authorization

    bookTable(table_num, seats_booked, null).then(
        data => {
            res.status(200)
            res.send({ success: true, message: "Table " + table_num + " has been booked" } as NormalResponse)
        }).catch(
            err => {
                res.status(400)
                res.send({ success: false, message: "Error booking the table" } as NormalResponse)
            })
});

module.exports = router;
