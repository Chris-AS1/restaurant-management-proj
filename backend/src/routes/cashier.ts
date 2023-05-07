import express from "express"
var router = express.Router();

router.get('/dashboard', function(req, res) {
  res.send('Cashier Dashboard');
});

router.get('/add_user', function(req, res) {
  res.send('');
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
