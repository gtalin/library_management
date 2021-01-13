const express = require('express');

const router = express.Router();
const apiController = require('../controllers/apiController');

// API GET request for list if all book items in json
router.get('/books', apiController.book_list);

module.exports = router;
