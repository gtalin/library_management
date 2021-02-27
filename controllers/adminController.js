const Author = require('../models/author');
const BookInstance = require('../models/bookinstance');

// Display detail page for a specific Author.
exports.admin_dashboard = async (req, res, next) => {
  let numOfBookCopies = null;
  let booksIssued = null;
  let booksAvailable = null;
  try {
    numOfBookCopies = await BookInstance.countDocuments({});
    booksIssued = await BookInstance.countDocuments({ status: 'Loaned' });
    booksAvailable = await BookInstance.countDocuments({ status: 'Available' });
  } catch (error) {
    error.status = 404;
    return next(error);
  }

  res.render('./admin/dashboard', {
    title: 'Dashboard',
    user: req.auth.user,
    numOfBookCopies,
    booksIssued,
    booksAvailable,
  });
};
