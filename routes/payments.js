const express = require('express');
const router = express.Router();
const { 
  addPayment, 
  getDelivererPayments 
} = require('../controllers/paymentController');

router.post('/', addPayment);
router.get('/deliverer-payments', getDelivererPayments);

module.exports = router;