const express = require('express');

const router = express.Router();
const basicAuth = require('express-basic-auth');

const basicAuthOptions = require('../config/basicAuthOptions');
const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');
const bookinstanceController = require('../controllers/bookinstanceController');

// protecting all routes
router.use(basicAuth(basicAuthOptions));
//  /********* BOOK ROUTES *********/ //
// Get catalog home page
router.get('/', bookController.index);

// GET request for displaying form which creates books
// NOTE: this must come before routes which use id param
router.get('/book/create', bookController.book_create_get);

// POST request for creating a book item
router.post('/book/create', bookController.book_create_post);

// GET request for deleting a book item
router.get('/book/:id/delete', bookController.book_delete_get);

// DELETE request for displaying delete form for a book item
router.post('/book/:id/delete', bookController.book_delete_post);

// GET request for displaying update a Book form
router.get('/book/:id/update', bookController.book_update_get);

// PUT request for updating a Book
router.post('/book/:id/update', bookController.book_update_post);

// GET request for displaying details of one book
router.get('/book/:id', bookController.book_detail);

// GET request for list if all book items
router.get('/books', bookController.book_list);
router.get('/books/:page', bookController.book_list);

//  /********* AUTHOR ROUTES *********/ //
// GET request for creating a Author. NOTE this must come before routes that display Author (uses id)
router.get('/author/create', authorController.author_create_get);

// POST request for creating Author
router.post('/author/create', authorController.author_create_post);

// GET request for deleting a Author
router.get('/author/:id/delete', authorController.author_delete_get);

// POST request for deleting a Author
router.post('/author/:id/delete', authorController.author_delete_post);

// GET request for updating a Author
router.get('/author/:id/update', authorController.author_update_get);

// POST request for updating a Author
router.post('/author/:id/update', authorController.author_update_post);

// GET request for one Author
router.get('/author/:id', authorController.author_detail);

// GET request for list of all Author items
router.get('/authors/', authorController.author_list);
router.get('/authors/:page', authorController.author_list);

//  /********* BOOKINSTANCE ROUTES *********/ //
// GET request for creating a BookInstance. NOTE this must come before routes that display BookInstance (uses id)
router.get(
  '/bookinstance/create',
  bookinstanceController.bookinstance_create_get
);

// POST request for creating BookInstance
router.post(
  '/bookinstance/create',
  bookinstanceController.bookinstance_create_post
);

// GET request for deleting a BookInstance
router.get(
  '/bookinstance/:id/delete',
  bookinstanceController.bookinstance_delete_get
);

// POST request for deleting a BookInstance
router.post(
  '/bookinstance/:id/delete',
  bookinstanceController.bookinstance_delete_post
);

// GET request for updating a BookInstance
router.get(
  '/bookinstance/:id/update',
  bookinstanceController.bookinstance_update_get
);

// POST request for updating a BookInstance
router.post(
  '/bookinstance/:id/update',
  bookinstanceController.bookinstance_update_post
);

// GET request for one BookInstance
router.get('/bookinstance/:id', bookinstanceController.bookinstance_detail);

// GET request for list of all BookInstance items
router.get('/bookinstances', bookinstanceController.bookinstance_list);
router.get('/bookinstances/:page', bookinstanceController.bookinstance_list);

// GET request for borrowing a particular BookInstance.
router.get(
  '/bookinstance/:id/borrow',
  bookinstanceController.bookinstance_borrow_get
);

// POST request for borrowing a particular BookInstance
router.post(
  '/bookinstance/:id/borrow',
  bookinstanceController.bookinstance_borrow_post
);

// GET request for borrowing a particular BookInstance.
router.get(
  '/bookinstance/:id/return',
  bookinstanceController.bookinstance_return_book
);

module.exports = router;
