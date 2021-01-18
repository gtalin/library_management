const { check, body, validationResult } = require('express-validator');
const BookInstance = require('../models/bookinstance');

const { isodateToString } = require('../utilities/stringmanipulation');
const Book = require('../models/book');
const escapeRegex = require('../utilities/regex-escape');

// const Publisher = require('../models/publisher');

// Display list of all BookInstances.
exports.bookinstance_list = async (req, res) => {
  let error;
  const data = {
    book_instance_list: undefined,
  };
  const resultsPerPage = 5; // results per page
  const pageNum = req.params.page || 1; // Page
  const searchQuery = req.query.search;
  // const searchQuery = 'the';

  const regex = searchQuery
    ? new RegExp(escapeRegex(searchQuery), 'gi')
    : new RegExp('');
  console.log(
    'search query ad the regEx are: ',
    searchQuery,

    regex
  );
  let numOfBookInstances;
  try {
    // data.book_instance_list = await BookInstance.find({}).populate('book');

    // data.book_instance_list = await BookInstance.find({})
    //   .skip(resultsPerPage * pageNum - resultsPerPage)
    //   .limit(resultsPerPage)
    //   .populate({
    //     path: 'book',
    //     select: 'title',
    //     populate: {
    //       path: 'author',
    //     },
    //   });

    data.book_instance_list = await BookInstance.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'book',
        },
      },
      // {
      //   $unwind: {
      //     path: '$book',
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      { $unwind: '$book' },
      // {
      //   $unwind: {
      //     path: '$book',
      //   },
      // },
      { $match: { 'book.title': regex } },
      {
        $lookup: {
          from: 'authors',
          localField: 'book.author',
          foreignField: '_id',
          as: 'book.author_name',
        },
      },

      { $skip: resultsPerPage * pageNum - resultsPerPage },
      { $limit: resultsPerPage },
    ]);

    // console.log(data.book_instance_list);

    // find({})
    //   .skip(resultsPerPage * pageNum - resultsPerPage)
    //   .limit(resultsPerPage)
    //   .populate({
    //     path: 'book',
    //     select: 'title',
    //     populate: {
    //       path: 'author',
    //     },
    //   });

    const bookCount = await BookInstance.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      { $match: { 'book.title': regex } },
      {
        $count: 'total_copies',
      },
    ]);

    numOfBookInstances = bookCount[0].total_copies;

    console.log('Number of book instances', bookCount, numOfBookInstances);
  } catch (error) {
    console.log('error is:', error);
    error = error;
  }
  res.render('./catalog/book_instance_list', {
    title: 'Book Instance List',
    search_title: 'book copies',
    data,
    searchQuery,
    pageNum,
    pages: Math.ceil(numOfBookInstances / resultsPerPage),
    error,
    numOfResults: numOfBookInstances,
    url: '/catalog/bookinstances',
  });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async (req, res, next) => {
  const data = {
    instance: undefined,
  };

  try {
    const instance = await BookInstance.findById(req.params.id).populate({
      path: 'book',
      select: 'title',
    });
    // .populate({ path: 'publisher', select: 'name' });
    // Only select the title field in book.

    data.instance = instance;
  } catch (error) {
    return next(error);
  }
  res.render('./catalog/book_instance_detail', { data });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ title: 1 });
    // const publishers = await Publisher.find().sort({ title: 1 });
    res.render('./catalog/book_instance_form', {
      title: 'Create BookInstance',
      books,
      // publishers,
    });
  } catch (errors) {
    return next(error);
  }
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  (req, res, next) => {
    console.log(
      'Body details before validation',
      req.body.id,
      req.body.book,
      // req.body.publisher,
      req.body.price,
      req.body.status,
      req.body.date_purchased
    );
    next();
  },
  // Validate data
  check('id')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please add an internal Id'),
  check('book').trim().isLength({ min: 1 }).withMessage('Please select a book'),
  check('book').trim().isLength({ min: 1 }).withMessage('Please add a book'),
  check('price').isNumeric().withMessage('Must be a number'),
  check('date_purchased')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date '),
  // check('date').isRFC3339().withMessage('Invalid date '),
  check('status')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Status must not be empty'),
  // Sanitize data
  body('id').escape(),
  body('book').escape(),
  // body('publisher').escape(),
  body('status').escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const book_instance = new BookInstance(req.body);
    // TODO:  check what's happening here with the date
    if (req.date_purchased === '') {
      book_instance.date_purchased = Date.now();
    }
    // if (req.due_back) {
    //   book_instance.due_back = req.body.due_back;
    // }
    // console.log('Book instance: ', book_instance);
    if (!errors.isEmpty()) {
      try {
        const books = await Book.find().sort({ title: 1 });
        res.render('./catalog/book_instance_form', {
          title: 'Create BookInstance',
          books,
          errors: errors.array(),
          book_instance: req.body,
        });
      } catch (error) {
        return next(error);
      }
    } else {
      try {
        console.log('Books instance in create is:', book_instance);
        await book_instance.save();
        req.flash('success', 'Book Instance created');
        res.redirect(book_instance.url);
      } catch (error) {
        return next(error);
      }
    }
  },
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = async (req, res, next) => {
  try {
    const instance = await BookInstance.findById(req.params.id).populate({
      path: 'book',
      select: 'title',
    });
    // .populate({ path: 'publisher', select: 'name' }); // populate title field of book field
    res.render('./catalog/book_instance_delete', { instance });
  } catch (error) {
    next(error);
  }
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = async (req, res, next) => {
  try {
    const { instanceid } = req.body;
    const bookDeleted = await BookInstance.findByIdAndDelete(instanceid);
    console.log(bookDeleted);
    req.flash('danger', 'Instance of Book deleted');
    res.redirect('/catalog/bookinstances');
  } catch (error) {
    next(error);
  }
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = async (req, res, next) => {
  try {
    const book_instance = await BookInstance.findById(req.params.id).populate(
      'book'
    );
    // .populate('publisher');
    // const books = await Book.find();
    // const publishers = await Publisher.find();
    console.log('Book instance is:', book_instance);
    // const instanceForForm = {
    //   book: book_instance.book._id,
    //   imprint: book_instance.imprint,
    //   status: book_instance.status,
    // };
    // book: book_instance.book._id because form expects a book id
    if (book_instance.date_purchased) {
      book_instance.dp = isodateToString(book_instance.date_purchased);
      console.log('Date purchased in book_instance is', book_instance.dp);
    }
    console.log('Book instance in update get is:', book_instance);
    res.render('./catalog/book_instance_form', {
      title: 'Update book instance',
      book_instance,
      // books,
      // publishers,
    });
  } catch (error) {
    next(error);
  }
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  // Validate data
  check('id')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please add an internal Id'),
  check('book').trim().isLength({ min: 1 }).withMessage('Please add a book'),
  // check('book').trim().isLength({ min: 1 }).withMessage('Please select a book'),
  check('price').isNumeric().withMessage('Must be a number'),
  check('date_purchased')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Invalid date '),
  // check('date').isRFC3339().withMessage('Invalid date '),
  check('status')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Status must not be empty'),
  // Sanitize data
  body('id').escape(),
  body('book').escape(),
  // body('publisher').escape(),
  body('status').escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        // if errors, re-render the form with errors
        // const books = await Book.find();
        // const publishers = await Publisher.find();
        res.render('./catalog/book_instance_form', {
          title: 'Update Book Instance',
          errors: errors.array(),
          book_instance: req.body,
          // books,
          // publishers,
        });
      } else {
        // if no errors: update instance, create flash message, redirect to its url page

        // const instance = new BookInstance({
        //   book: req.body.book,
        //   imprint: req.body.imprint,
        //   due_back: req.body.due_back,
        //   status: req.body.status,
        //   _id: req.params.id,
        // });
        const instance = new BookInstance(req.body);
        instance._id = req.params.id;
        console.log('Book instance in update POST', instance);
        await BookInstance.findByIdAndUpdate(req.params.id, instance);
        req.flash('success', 'Book Instance updated');
        res.redirect(instance.url);
      }
    } catch (error) {
      next(error);
    }
  },
];
