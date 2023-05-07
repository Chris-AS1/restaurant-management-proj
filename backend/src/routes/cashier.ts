import express from "express"
import { addTestCashier, showCashier } from "./../mongo"
import { cashierInterface, cashierModel, cashierSchema } from "../schemas/cashier.schema";

var router = express.Router();

router.get('/dashboard', function(req, res) {
    res.send('Cashier Dashboard');
});

router.get('/add_user', function(req, res) {
    addTestCashier()
    res.send('');
});

router.get('/show_user/:id', async function(req, res) {
    let a = await showCashier(req.params.id)
    res.send(JSON.stringify(a));
});


router.get('/create_receipt', function(req, res) {
    res.send('');
});

router.get('/get_pending_orders', function(req, res) {
    res.send('');
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

router.get('/create_receipt', function(req, res) {
    res.send('');
});

module.exports = router;
