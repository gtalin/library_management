const { check, validationResult, body } = require('express-validator');
const {
  capitalizeWord,
  // isodateToString,
} = require('../utilities/stringmanipulation');

// const Author = require('../models/author');
const Publisher = require('../models/publisher');
const BookInstance = require('../models/bookinstance');

// Display list of all Publishers.
exports.publisher_list = async (req, res, next) => {
  let error;
  const data = {
    publisher_list: [],
    bookCount: [],
  };
  try {
    data.publisher_list = await Publisher.find();
    // Use method defined on AuthorSchema to get bookCount
    for (let i = 0; i < data.publisher_list.length; i++) {
      const publisher = data.publisher_list[i];
      const count = await publisher.getBookCount();
      data.publisher_list[i].bookCount = count;
    }
  } catch (error) {
    console.log('error is:', error);
    error = error;
    return next(error);
  }
  res.render('./catalog/publisher_list', {
    title: 'Publisher List',
    error,
    data,
  });
};

// Display detail page for a specific Publisher.
exports.publisher_detail = async (req, res, next) => {
  let title = 'Publisher: ';
  const data = {
    author: null,
    books: [],
  };
  try {
    const publisher = await Publisher.findById({ _id: req.params.id });
    const books = await BookInstance.find(
      { publisher: req.params.id },
      'title status'
    );
    data.publisher = publisher;
    data.books = books;
    title += publisher.name;
  } catch (error) {
    // if (error) return next(error);
    // Customised error message
    if (data.publisher == null) {
      error = new Error('Publisher not found');
      error.status = 404;
      return next(error);
    }
    return next(error);
  }
  res.render('./catalog/publisher_detail', { title, data });
};

// Display Publisher create form on GET.
exports.publisher_create_get = async (req, res) => {
  res.render('./catalog/publisher_form', { title: 'Create Publisher' });
};

// Handle Publisher create on POST
exports.publisher_create_post = [
  // Validate fields
  check('name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Name must be specified'),

  // Sanitize fields
  body('name').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('./catalog/publisher_form', {
        title: 'Create Publisher',
        publisher: req.body,
        errors: errors.array(),
      });
    } else {
      const publisher = new Publisher({
        name: capitalizeWord(req.body.name),
      });
      try {
        await publisher.save();
        req.flash('success', 'Publisher Created');
        res.redirect(publisher.url);
      } catch (error) {
        return next(error);
      }
    }
  },
];

// Display Publisher delete form on GET.
exports.publisher_delete_get = async (req, res, next) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    const books = await BookInstance.find({ publisher });
    res.render('./catalog/publisher_delete', {
      title: 'Delete Publisher',
      publisher,
      books,
    });
  } catch (error) {
    console.log('There is an error in publisher delete page: ', error);
    return next(error);
  }
};

// Handle Publisher delete on POST.
exports.publisher_delete_post = async (req, res, next) => {
  try {
    const publisher = await Publisher.findById(req.body.publisherid);
    const books_bypublisher = await BookInstance.find({ publisher });
    if (books_bypublisher && books_bypublisher.length != 0) {
      // Can't delete books
      req.flash('danger', 'Cannot delete publisher');
      res.redirect('/catalog/publishers');
    } else {
      // Delete the publisher.
      await Publisher.findByIdAndDelete(req.body.publisherid);
      req.flash('danger', 'Publisher deleted');
      res.redirect('/catalog/publishers');
    }
  } catch (error) {
    return next(error);
  }
};

// Display Publisher update form on GET.
exports.publisher_update_get = async (req, res, next) => {
  try {
    const publisher = await Publisher.findById(req.params.id);

    const publisherForForm = {
      name: publisher.name,
    };

    console.log(publisherForForm);
    res.render('./catalog/publisher_form', {
      title: 'Update Publisher',
      publisher: publisherForForm,
    });
  } catch (error) {
    next(error);
  }
};

// Handle publisher update on POST.
exports.publisher_update_post = [
  // Validation
  check('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name cannot be empty'),

  // Sanitization
  body('name').escape(),

  async (req, res, next) => {
    // Check for errors
    // If errors, re-render the form
    // If no errors update the publisher (capitalize the fname, lname)
    // try catch for async/operations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Errors in the form. Rerender it with errors
      res.render('./catalog/publisher_form', {
        title: 'Update Publisher',
        errors: errors.array(),
        publisher: req.body,
      });
    } else {
      // Capitalize fname and lname
      // Create new publisher object and Update in the DB
      // Send flash message and redirect
      const newPublisher = new Publisher({
        name: capitalizeWord(req.body.name),
        _id: req.params.id,
      });

      try {
        await Publisher.findByIdAndUpdate(req.params.id, newPublisher);
        req.flash('success', 'Publisher updated');
        res.redirect(newPublisher.url);
      } catch (error) {
        next(error);
      }
    }
  },
];
