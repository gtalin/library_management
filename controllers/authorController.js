const { check, validationResult, body } = require('express-validator');
const {
  capitalizeWord,
  isodateToString,
} = require('../utilities/stringmanipulation');

const Author = require('../models/author');
const Book = require('../models/book');

// Display list of all Authors.
exports.author_list = async (req, res, next) => {
  let error;
  const data = {
    author_list: [],
    bookCount: [],
  };
  try {
    data.author_list = await Author.find();
    // Use method defined on AuthorSchema to get bookCount
    for (let i = 0; i < data.author_list.length; i++) {
      const author = data.author_list[i];
      const count = await author.getBookCount();
      data.author_list[i].bookCount = count;
    }
  } catch (error) {
    console.log('error is:', error);
    error = error;
    return next(error);
  }
  res.render('./catalog/author_list', { title: 'Author List', error, data });
};

// Display detail page for a specific Author.
exports.author_detail = async (req, res, next) => {
  let title = 'Author: ';
  const data = {
    author: null,
    books: [],
  };
  try {
    const author = await Author.findById({ _id: req.params.id });
    const books = await Book.find({ author: req.params.id }, 'title summary');
    data.author = author;
    data.books = books;
    title += author.name;
  } catch (error) {
    // if (error) return next(error);
    // Customised error message
    if (data.author == null) {
      error = new Error('Author not found');
      error.status = 404;
      return next(error);
    }
    return next(error);
  }
  res.render('./catalog/author_detail', { title, data });
};

// Display Author create form on GET.
exports.author_create_get = async (req, res) => {
  res.render('./catalog/author_form', { title: 'Create Author' });
};

// Handle Author create on POST
exports.author_create_post = [
  // Validate fields
  check('fname')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified'),
  // .isAlphanumeric()
  // .withMessage('First name has non-alphanumeric characters'),
  check('lname')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Last name must be specified'),
  // .isAlphanumeric()
  // .withMessage('Last name has non-alphanumeric characters'),
  check('dob')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date of birth'),
  check('dod')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date of death'),
  // Sanitize fields
  body('fname').escape(),
  body('lname').escape(),
  // Not doing dates here because then on error form will not auto-fill
  // body('dob').toDate(),
  // body('dod').toDate(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('./catalog/author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array(),
      });
    } else {
      const author = new Author({
        first_name: capitalizeWord(req.body.fname),
        family_name: capitalizeWord(req.body.lname),
        date_of_birth: req.body.dob,
        date_of_death: req.body.dod,
      });
      try {
        await author.save();
        req.flash('success', 'Author Created');
        res.redirect(author.url);
      } catch (error) {
        return next(error);
      }
    }
  },
];

// Display Author delete form on GET.
exports.author_delete_get = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author });
    res.render('./catalog/author_delete', {
      title: 'Delete Author',
      author,
      books,
    });
  } catch (error) {
    console.log('There is an error in author delete page: ', error);
    return next(error);
  }
};

// Handle Author delete on POST.
exports.author_delete_post = async (req, res, next) => {
  try {
    const author = await Author.findById(req.body.authorid);
    const books_byauthor = await Book.find({ author });
    if (books_byauthor && books_byauthor.length != 0) {
      // Can't delete books
      req.flash('danger', 'Cannot delete author');
      res.redirect('/catalog/authors');
    } else {
      // Delete the author.
      await Author.findByIdAndDelete(req.body.authorid);
      req.flash('danger', 'Author deleted');
      res.redirect('/catalog/authors');
    }
  } catch (error) {
    return next(error);
  }
};

// Display Author update form on GET.
exports.author_update_get = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);

    const authorForForm = {
      fname: author.first_name,
      lname: author.family_name,
    };
    if (author.date_of_birth) {
      authorForForm.dob = isodateToString(author.date_of_birth);
    }
    if (author.date_of_death) {
      authorForForm.dod = isodateToString(author.date_of_death);
    }
    console.log(authorForForm);
    res.render('./catalog/author_form', {
      title: 'Update Author',
      author: authorForForm,
    });
  } catch (error) {
    next(error);
  }
};

// Handle Author update on POST.
exports.author_update_post = [
  // Validation
  check('fname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name cannot be empty')
    .isAlphanumeric()
    .withMessage('First name has alphanumeric characters'),
  check('lname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Family name cannot be empty')
    .isAlphanumeric()
    .withMessage('Family name has alphanumeric characters'),
  check('dob')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date of birth'),
  check('dod')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date of death'),
  // Sanitization
  body('fname').escape(),
  body('lname').escape(),

  async (req, res, next) => {
    // Check for errors
    // If errors, re-render the form
    // If no errors update the author (capitalize the fname, lname)
    // try catch for async/operations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Errors in the form. Rerender it with errors
      res.render('./catalog/author_form', {
        title: 'Update Author',
        errors: errors.array(),
        author: req.body,
      });
    } else {
      // Capitalize fname and lname
      // Create new author object and Update in the DB
      // Send flash message and redirect
      const newAuthor = new Author({
        first_name: capitalizeWord(req.body.fname),
        family_name: req.body.lname,
        _id: req.params.id,
      });
      if (req.body.dob) {
        newAuthor.date_of_birth = isodateToString(req.body.dob);
      }

      if (req.body.dod) {
        newAuthor.date_of_death = isodateToString(req.body.dod);
      }
      try {
        await Author.findByIdAndUpdate(req.params.id, newAuthor);
        req.flash('success', 'Author updated');
        res.redirect(newAuthor.url);
      } catch (error) {
        next(error);
      }
    }
  },
];
