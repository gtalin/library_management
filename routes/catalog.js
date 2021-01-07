const express = require('express');

const router = express.Router();

const book_controller = require('../controllers/bookController');
const author_controller = require('../controllers/authorController');
const genre_controller = require('../controllers/genreController');
const borrower_controller = require('../controllers/borrowerController');
