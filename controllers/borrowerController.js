// const mongoose = require('mongoose');
const { check, validationResult, body } = require('express-validator');

const Borrower = require('../models/borrower');
const BookInstance = require('../models/bookinstance');

const escapeRegex = require('../utilities/regex-escape');

// Display list of all borrowers.
exports.borrower_list = async (req, res) => {
  let error;
  const data = {
    borrower_list: undefined,
  };
  const resultsPerPage = 10; // results per page
  const pageNum = req.params.page || 1; // Page
  const searchQuery = req.query.search;
  console.log(searchQuery);
  const regex = searchQuery
    ? new RegExp(escapeRegex(searchQuery), 'gi')
    : new RegExp('');
  console.log('search query and the regEx are: ', regex, searchQuery);
  let numOfBorrowers;
  try {
    data.borrower_list = await Borrower.find({ name: regex })
      .skip(resultsPerPage * pageNum - resultsPerPage)
      .limit(resultsPerPage);

    numOfBorrowers = await Borrower.countDocuments({ name: regex });
  } catch (error) {
    error = error;
  }
  res.render('./borrower/borrower_list', {
    title: 'Borrower List',
    search_title: 'borrowers',
    data,
    searchQuery,
    pageNum,
    pages: Math.ceil(numOfBorrowers / resultsPerPage),
    error,
    numOfResults: numOfBorrowers,
    // url: '/catalog/books',
    url: '/borrower/borrowers',
  });
};

// Display detail page for a specific book.
exports.borrower_detail = async (req, res, next) => {
  const title = 'Borrower Details';
  let error;
  const data = {
    borrowerDetails: undefined,
    books: [],
  };
  const borrowerId = req.params.id;
  try {
    data.borrowerDetails = await Borrower.findById(borrowerId);
    // .populate('genre');
    console.log('The borrower Id is:', borrowerId);
    const books = await BookInstance.find({ borrower: borrowerId }).populate(
      'book'
    );
    data.books = books;
  } catch (error) {
    console.log(error);

    if (data.borrowerDetails == null) {
      // No results.
      error = new Error('Borrower not found');
      error.status = 404;
      return next(error);
    }
    if (error) {
      return next(error);
    }
  }

  res.render('./borrower/borrower_detail', { title, data, error });
};

// Display book create form on GET.
exports.borrower_create_get = async (req, res, next) => {
  try {
    // const authors = await Author.find();
    // const genres = await Genre.find();
    res.render('./borrower/borrower_form', {
      title: 'Create Borrower',
      // authors,
      // genres,
    });
  } catch (error) {
    return next(error);
  }
};

// Handle borrower create on POST.
exports.borrower_create_post = [
  // Validate fields
  check('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name Must not be empty'),
  check('mobileNumber')
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage(
      'Total length of Mobile Number should be 10 (prefix with 0 if number smaller than 10'
    )
    .isInt()
    .withMessage('Only numbers permitted'),
  check('address')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Address must not be empty'),

  // Sanitize fields (using wild card)
  body('name').escape(),
  body('mobileNumber').escape(),
  body('address').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    // Book object
    console.log('Borrower details:', req.body);
    console.log('Errors is,', errors);
    const borrower = new Borrower(req.body);

    if (!errors.isEmpty()) {
      // re-render the form with the entered values

      res.render('./borrower/borrower_form', {
        title: 'Create Borrower',
        borrower: req.body,
        errors: errors.array(),
      });
    } else {
      try {
        await borrower.save();
        req.flash('success', 'Borrower Created');
        res.redirect(borrower.url);
      } catch (error) {
        return next(error);
      }
    }
  },
];

// Display borrower delete form on GET.
exports.borrower_delete_get = async (req, res, next) => {
  try {
    const borrower = await Borrower.findById(req.params.id);

    res.render('./borrower/borrower_delete', { borrower });
  } catch (error) {
    return next(error);
  }
};

// Handle book delete on POST.
exports.borrower_delete_post = async (req, res, next) => {
  try {
    const { borrowerid } = req.body;
    const booksIssued = await BookInstance.find({ borrower: borrowerid });
    if (booksIssued.length === 0) {
      await Borrower.findByIdAndDelete(borrowerid);
      req.flash('danger', 'Borrower deleted');
      res.redirect('/borrower/borrowers');
    } else {
      req.flash(
        'danger',
        'Cannot delete the borrower! Please return the books issued to the borrower before attempting to delete them.'
      );
      res.redirect(`/borrower/${borrowerid}`);
    }
  } catch (error) {
    next(error);
  }
};

// Display book update form on GET.
exports.borrower_update_get = async (req, res, next) => {
  try {
    const borrowerid = req.params.id;
    const borrower = await Borrower.findById(borrowerid);

    res.render('./borrower/borrower_form', {
      title: 'Update Borrower',
      borrower,
    });
  } catch (error) {
    next(error);
  }
};

// Handle book update on POST.
exports.borrower_update_post = [
  // Validate fields
  check('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name Must not be empty'),
  check('mobileNumber')
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage(
      'Total length of Mobile Number should be 10 (prefix with 0 if number smaller than 10'
    )
    .isInt()
    .withMessage('Only numbers permitted'),
  check('address')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Address must not be empty'),

  // Sanitize fields (using wild card)
  body('name').escape(),
  body('mobileNumber').escape(),
  body('address').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const { name, mobileNumber, address } = req.body;

    const borrower = {
      name,
      mobileNumber,
      address,
    };
    console.log('Errors are: ', errors.array());
    if (!errors.isEmpty()) {
      // There is an error and we need to re-render the form with errors
      res.render('./borrower/borrower_form', {
        title: 'Update Borrower',
        errors: errors.array(),
        borrower,
      });
    } else {
      try {
        const borrowerCreated = await Borrower.findByIdAndUpdate(
          req.params.id,
          borrower,
          { new: true }
        );

        req.flash('success', 'Borrower information updated!');
        res.redirect(borrowerCreated.url);
      } catch (error) {
        next(error);
      }
    }
  },
];
