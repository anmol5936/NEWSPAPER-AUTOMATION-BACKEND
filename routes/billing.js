const express = require('express');
const router = express.Router();
const { getBills } = require('../controllers/billingController');

router.get('/', getBills);

module.exports = router;