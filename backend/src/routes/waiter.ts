import express from "express"
import { NormalResponse } from "../models/responses/normal.response.model";
import { TableList } from "../models/responses/tablelist.response.model"
import { getTables } from "../db/waiter"

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

module.exports = router;
