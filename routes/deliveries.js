const express = require('express');
const router = express.Router();
const { 
  getTodayDeliveries, 
  getSummary 
} = require('../controllers/deliveryController');

router.get('/today', getTodayDeliveries);
router.get('/summary', getSummary);

module.exports = router;