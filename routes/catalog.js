const express = require('express');

const router = express.Router();

const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');
// const genreController = require('../controllers/genreController');
const publisherController = require('../controllers/publisherController');
const bookinstanceController = require('../controllers/bookinstanceController');
// const borrowerController = require('../controllers/borrowerController');

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

// //  /********* GENRE ROUTES *********/ //
// // GET request for creating a Genre. NOTE this must come before routes that display Genre (uses id)
// router.get('/genre/create', genreController.genre_create_get);

// // POST request for creating Genre
// router.post('/genre/create', genreController.genre_create_post);

// // GET request for deleting a Genre
// router.get('/genre/:id/delete', genreController.genre_delete_get);

// // POST request for deleting a Genre
// router.post('/genre/:id/delete', genreController.genre_delete_post);

// // GET request for updating a Genre
// router.get('/genre/:id/update', genreController.genre_update_get);

// // POST request for updating a Genre
// router.post('/genre/:id/update', genreController.genre_update_post);

// // GET request for one Genre
// router.get('/genre/:id', genreController.genre_detail);

// // GET request for list of all Genre items
// router.get('/genres', genreController.genre_list);

//  /********* PUBLISHER ROUTES *********/ //
// GET request for creating a Genre. NOTE this must come before routes that display Publisher (uses id)
router.get('/publisher/create', publisherController.publisher_create_get);

// POST request for creating publisher
router.post('/publisher/create', publisherController.publisher_create_post);

// GET request for deleting a publisher
router.get('/publisher/:id/delete', publisherController.publisher_delete_get);

// POST request for deleting a publisher
router.post('/publisher/:id/delete', publisherController.publisher_delete_post);

// GET request for updating a publisher
router.get('/publisher/:id/update', publisherController.publisher_update_get);

// POST request for updating a publisher
router.post('/publisher/:id/update', publisherController.publisher_update_post);

// GET request for one publisher
router.get('/publisher/:id', publisherController.publisher_detail);

// GET request for list of all publisher items
router.get('/publishers', publisherController.publisher_list);
router.get('/publishers/:page', publisherController.publisher_list);

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

module.exports = router;
