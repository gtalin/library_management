// const mongoose = require('mongoose');
const { check, validationResult, body } = require('express-validator');

const Book = require('../models/book');
const Author = require('../models/author');
// const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const escapeRegex = require('../utilities/regex-escape');

exports.index = async (req, res) => {
  let error;
  const data = {
    book_count: undefined,
    book_instance_count: undefined,
    book_instance_available_count: undefined,
    author_count: undefined,
    // genre_count: undefined,
  };
  try {
    data.book_count = await Book.countDocuments();
    data.book_instance_count = await BookInstance.countDocuments();
    data.book_instance_available_count = await BookInstance.countDocuments({
      status: 'Available',
    });
    data.author_count = await Author.countDocuments();
    // data.genre_count = await Genre.countDocuments();
  } catch (error) {
    error = error;
  }

  res.render('./catalog/index', { title: 'Library stats', data, error });
};

// Display list of all books.
exports.book_list = async (req, res) => {
  let error;
  const data = {
    book_list: undefined,
  };
  const resultsPerPage = 5; // results per page
  const pageNum = req.params.page || 1; // Page
  const searchQuery = req.query.search;
  console.log(searchQuery);
  const regex = searchQuery
    ? new RegExp(escapeRegex(searchQuery), 'gi')
    : new RegExp('');
  console.log('search query ad the regEx are: ', regex, searchQuery);
  let numOfBooks;
  try {
    data.book_list = await Book.find({ title: regex }, 'title author')
      .skip(resultsPerPage * pageNum - resultsPerPage)
      .limit(resultsPerPage)
      .populate('author');

    numOfBooks = await Book.countDocuments({ title: regex });
  } catch (error) {
    error = error;
  }
  res.render('./catalog/book_list', {
    title: 'Book List',
    search_title: 'books',
    data,
    searchQuery,
    pageNum,
    pages: Math.ceil(numOfBooks / resultsPerPage),
    error,
    numOfResults: numOfBooks,
    url: '/catalog/books',
  });
};

// Display detail page for a specific book.
exports.book_detail = async (req, res, next) => {
  let title = 'Title: ';
  let error;
  const data = {
    bookDetails: undefined,
    bookInstances: undefined,
  };
  try {
    const bookDetails = await Book.findById(req.params.id).populate('author');
    // .populate('genre');
    // const bookInstances = await BookInstance.find({ book: req.params.id });

    title += bookDetails.title;
    data.bookDetails = bookDetails;
    // data.bookInstances = bookInstances;
  } catch (error) {
    console.log(error);

    if (data.bookDetails == null) {
      // No results.
      error = new Error('Book not found');
      error.status = 404;
      return next(error);
    }
    if (error) {
      return next(error);
    }
  }

  res.render('./catalog/book_detail', { title, data, error });
};

// Display book create form on GET.
exports.book_create_get = async (req, res, next) => {
  try {
    const authors = await Author.find();
    // const genres = await Genre.find();
    res.render('./catalog/book_form', {
      title: 'Create Book',
      authors,
      // genres,
    });
  } catch (error) {
    return next(error);
  }
};

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    // console.log('Genre is: ', req.body.genre);
    // if (!req.body.genre instanceof Array) {
    //   if (typeof req.body.genre === 'undefined') req.body.genre = [];
    //   else req.body.genre = new Array(req.body.genre);
    // }
    // console.log('Genre is: ', req.body.genre);
    next();
  },
  // Validate fields
  check('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title Must not be empty'),
  check('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Author must not be empty'),
  // check('summary')
  //   .trim()
  //   .isLength({ min: 1 })
  //   .withMessage('Summary must not be empty'),
  // check('isbn')
  //   .trim()
  //   .isLength({ min: 1 })
  //   .withMessage('ISBN must not be empty'),
  // Sanitize fields (using wild card)
  body('title').escape(),
  body('author').escape(),
  // body('genre').escape(),
  body('summary').escape(),
  // body('isbn').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    // Book object
    console.log(
      'Book details:',
      req.body.title,
      req.body.author,
      req.body.summary
      // req.body.isbn,
      // req.body.genre
    );
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      // isbn: req.body.isbn,
      // genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // re-render the form with the entered values
      try {
        const authors = await Author.find();
        // const genres = await Genre.find();
        // for (let i = 0; i < genres.length; i++) {
        //   if (book.genre.indexOf(genres[i]._id) > -1) {
        //     genres[i].checked = 'true';
        //   }
        // }

        res.render('./catalog/book_form', {
          title: 'Create Book',
          book: req.body,
          authors,
          // genres,
          errors: errors.array(),
        });
      } catch (error) {
        return next(error);
      }
    } else {
      try {
        // const book = new Book({
        //   title: req.body.title,
        //   author: req.body.author,
        //   summary: req.body.summary,
        //   isbn: req.body.isbn,
        //   genre: req.body.genre
        // });
        await book.save();
        req.flash('success', 'Book Created');
        res.redirect(book.url);
      } catch (error) {
        return next(error);
      }
    }
  },
];

// Display book delete form on GET.
exports.book_delete_get = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    // .populate('genre');
    const bookInstances = await BookInstance.find({ book });
    res.render('./catalog/book_delete', { book, bookInstances });
  } catch (error) {
    return next(error);
  }
};

// Handle book delete on POST.
exports.book_delete_post = async (req, res, next) => {
  try {
    const { bookid } = req.body;
    const book = await Book.findById(bookid).populate('author');
    const instances = await BookInstance.find({ book }).populate();
    if (instances && instances.length !== 0) {
      // instances exist can't delete
      req.flash('danger', 'Book cannot be deleted');
      res.redirect('/catalog/books');
    } else {
      await Book.findByIdAndDelete(bookid);
      req.flash('danger', 'Book deleted');
      res.redirect('/catalog/books');
    }
  } catch (error) {
    next(error);
  }
};

// Display book update form on GET.
exports.book_update_get = async (req, res, next) => {
  try {
    const bookid = req.params.id;
    const book = await Book.findById(bookid)
      .populate('author')
      .populate('genre');

    const authors = await Author.find();
    // const genres = await Genre.find();
    // for (let genreIx = 0; genreIx < genres.length; genreIx++) {
    //   for (let bookGIx = 0; bookGIx < book.genre.length; bookGIx++) {
    //     if (
    //       genres[genreIx]._id.toString() == book.genre[bookGIx]._id.toString()
    //     ) {
    //       genres[genreIx].checked = 'true';
    //     }
    //   }
    // }
    res.render('./catalog/book_form', {
      title: 'Update Book',
      authors,
      // genres,
      book,
    });
  } catch (error) {
    next(error);
  }
};

// Handle book update on POST.
exports.book_update_post = [
  // middleware to convert genre to an array
  (req, res, next) => {
    // if (!req.body.genre instanceof Array) {
    //   if (typeof req.body.genre === 'undefiend') req.body.genre = [];
    //   else req.body.genre = new Array(req.body.genre);
    // }
    next();
  },
  // Validate fields
  check('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title Must not be empty'),
  check('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Author must not be empty'),
  // check('summary')
  //   .trim()
  //   .isLength({ min: 1 })
  //   .withMessage('Summary must not be empty'),
  // check('isbn')
  //   .trim()
  //   .isLength({ min: 1 })
  //   .withMessage('ISBN must not be empty'),
  // Sanitize fields
  body('title').escape(),
  body('author').escape(),
  body('summary').escape(),
  // body('isbn').escape(),
  // body('genre.*').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      // isbn: req.body.isbn,
      // genre: req.body.genre,
      _id: req.params.id,
    });
    console.log('The book object is: ', book);
    console.log('Errors are: ', errors.array());
    if (!errors.isEmpty()) {
      // There is an error and we need to re-render the form with errors
      try {
        const authors = await Author.find();
        // const genres = await Genre.find();
        // for (let i = 0; i < genres.length; i++) {
        //   if (book.genre.indexOf(genres[i] != -1)) genres[i].checked = 'true';
        // }
        res.render('./catalog/book_form', {
          title: 'Update Book',
          authors,
          // genres,
          errors: errors.array(),
          book,
        });
      } catch (error) {
        next(error);
      }
    } else {
      try {
        const bookCreated = await Book.findByIdAndUpdate(req.params.id, book);
        console.log('Book object and newly created object', book, bookCreated);
        req.flash('success', 'Book information updated!');
        res.redirect(book.url);
      } catch (error) {
        next(error);
      }
    }
  },
];
