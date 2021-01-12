const mongoose = require('mongoose');
// const validator = require('express-validator');
const { check, validationResult, body } = require('express-validator');
const { capitalizeWord } = require('../utilities/stringmanipulation');

const Genre = require('../models/genre');
const Book = require('../models/book');

// Display list of all genre
exports.genre_list = async (req, res) => {
  const data = {
    genre_list: [],
  };
  let error;
  data.genre_list = await Genre.find();
  for (let i = 0; i < data.genre_list.length; i++) {
    const genre = data.genre_list[i];
    const count = await Book.countDocuments({
      genre: genre._id,
    });
    console.log('count is: ', count);
    data.genre_list[i].bookCount = count;
  }
  res.render('./catalog/genre_list', { title: 'Genre List', data, error });
};

// Display details page for a specific genre
exports.genre_detail = async (req, res, next) => {
  const { id } = req.params;
  let error;
  const data = {
    books: [],
  };
  let title = 'Genre: ';
  try {
    const books = await Book.find({ genre: id });
    const genre = await Genre.findById({ _id: id });
    title = `Genre: ${genre.name}`;

    data.books = books;
    data.genre = genre;
  } catch (error) {
    console.log(error);
    error = error;
    if (error) {
      return next(error);
    }
    if (data.books.genre == null) {
      error = new Error('Genre not found');
      error.status = 404;
      return next(error);
    }
  }
  res.render('./catalog/genre_detail', { title, data, error });
};

// Display Genre create form on GET
exports.genre_create_get = async (req, res) => {
  res.render('./catalog/genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Array of middlewares

  // Validate that the name field is not empty
  // validator.body('name', 'Genre name required').trim().isLength({min: 1}),
  check('name').trim().isLength({ min: 1 }).withMessage('Genre name required'),

  // Sanitize (escape) the name field
  // body('name').not().isEmpty().trim().escape(),
  body('name').escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from request
    const errors = validationResult(req);
    console.log('errors is: ', errors);

    if (!errors.isEmpty()) {
      // There are erros in the form
      // Render the form again with sanitized values and error messages
      return res.render('./catalog/genre_form', {
        title: 'Genre Form',
        errors: errors.array(),
        genre: req.body.name,
      });
    }

    // Data from form is valid
    // Check if Genre with same name already exists

    // Craete a genre object with escaped and trimmed data
    // As well as capitalized name

    const nameCap = capitalizeWord(req.body.name);
    const genre = new Genre({
      name: nameCap,
    });
    try {
      const genreInDb = await Genre.findOne({ name: nameCap });
      if (genreInDb) {
        req.flash('success', 'Genre exists');
        return res.redirect(genreInDb.url);
      }

      genre.save();
      req.flash('success', 'Genre created');
      res.redirect(genre.url);
    } catch (error) {
      return next(error);
    }
  },
];

// Display Genre delete form on GET
exports.genre_delete_get = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id);
    const books = await Book.find({ genre });
    res.render('./catalog/genre_delete', { genre, books });
  } catch (error) {
    return next(error);
  }
};

// Handle Genre delete on POST.
exports.genre_delete_post = async (req, res, next) => {
  try {
    const { genreid } = req.body;
    const genre = await Genre.findById(genreid);
    const books = await Book.find({ genre });
    console.log('GenreID :', genreid);
    console.log('Books of the genere we want to delete are :', books);
    if (books && books.length != 0) {
      // cannot delete book. Send a flash message
      req.flash('danger', 'Genre cannot be deleted');
      res.redirect('/catalog/genres');
    } else {
      // delete book and send a flash message
      await Genre.findByIdAndDelete(genreid);
      req.flash('danger', 'Genre deleted');
      res.redirect('/catalog/genres');
    }
  } catch (error) {
    next(error);
  }
};

// Display Genre update form on GET
exports.genre_update_get = async (req, res, next) => {
  try {
    const genreid = req.params.id;
    const genre = await Genre.findById(genreid);
    res.render('./catalog/genre_form', { title: 'Update Genre', genre });
  } catch (error) {
    next(error);
  }
};

// Handle Genre update on POST.
exports.genre_update_post = [
  // Validation
  check('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Genre name cannot be empty'),
  // Sanitization
  body('name').escape(),
  async (req, res, next) => {
    try {
      const genreId = req.params.id;
      const genre = new Genre({ name: req.body.name, _id: genreId });
      const errors = validationResult(req);
      // Check if validation errors and re-render form if errors
      if (!errors.isEmpty()) {
        const genre = await Genre.findById(genreId);
        res.render('./catalog/genre_form', {
          title: 'Update Genre',
          errors: errors.array(),
          genre,
        });
      } else {
        // No errors but check if genre name already exists
        const nameCap = capitalizeWord(req.body.name);
        const genreInDb = await Genre.findOne({ name: nameCap });
        if (genreInDb && genreInDb._id.toString() !== genreId) {
          req.flash('danger', 'Genre name already exists');
          res.render('./catalog/genre_form', { title: 'Update Genre', genre });
        } else {
          // save the updated genre
          genre.name = nameCap;
          await Genre.findByIdAndUpdate(genreId, genre);
          req.flash('success', 'Genre name updated');
          res.redirect(genre.url);
        }
      }
    } catch (error) {
      next(error);
    }
  },
];
