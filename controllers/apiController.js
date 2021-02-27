// const { check, validationResult, body } = require('express-validator');

// const { name } = require('ejs');
const Book = require('../models/book');
const Author = require('../models/author');
const BookInstance = require('../models/bookinstance');
const Borrower = require('../models/borrower');

/** ********
 **** controller for all api related routes ****
 ************ */

/** ********
 ********** json list of books **********
 ************ */
// Display list of all books.
exports.book_list = async (req, res) => {
  const data = {
    book_list: undefined,
  };
  try {
    data.book_list = await Book.find({}, 'title');
  } catch (error) {
    console.log(error);
    res.send({ error: 'An error occured' });
  }
  // res.json({ books: data.book_list });
  res.send({ books: data.book_list });
};

exports.author_list = async (req, res) => {
  const data = {
    author_list: undefined,
  };

  try {
    data.author_list = await Author.find({});
  } catch (error) {
    res.send({ error: 'An error occured' });
  }
  res.send({ authors: data.author_list });
};

exports.borrower_list = async (req, res) => {
  const data = {
    borrower_list: undefined,
  };
  try {
    data.borrower_list = await Borrower.find({}, 'name');
  } catch (error) {
    console.log(error);
    res.send({ error: 'An error occured' });
  }

  res.send({ borrowers: data.borrower_list });
};
