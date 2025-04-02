const express = require('express');
const router = express.Router();
const { addPublication, editPublication } = require('../controllers/publicationController');

router.post('/', addPublication);
router.put('/:id', editPublication);

module.exports = router;