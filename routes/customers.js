const express = require('express');
const router = express.Router();
const { 
  addCustomer, 
  editCustomer, 
  withholdSubscription 
} = require('../controllers/customerController');

router.post('/', addCustomer);
router.put('/:id', editCustomer);
router.post('/withhold', withholdSubscription);

module.exports = router;