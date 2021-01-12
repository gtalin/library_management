const mongoose = require('mongoose');
const moment = require('moment');

const Book = require('./book');

const AuthorSchema = new mongoose.Schema({
  first_name: { type: String, require: true, max: 100 },
  family_name: { type: String, require: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// method describe to get all books by an author
//  Can probably be cached as well
AuthorSchema.method('getBookCount', function () {
  return Book.countDocuments({ author: this._id })
    .then((data) => {
      console.log('Number of books: ', data);
      return data;
    })
    .catch(console.log('Some error with the result'));
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(function () {
  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  } else if (!this.first_name && this.family_name) {
    fullname = this.family_name;
  } else if (this.first_name && !this.family_name) {
    fullname = this.first_name;
  }
  return fullname;
});

// Virtual for Formatted age of Birth
AuthorSchema.virtual('dob_formatted').get(function () {
  return this.date_of_birth
    ? moment(this.date_of_birth).format('MMMM Do YYYY')
    : '';
});

AuthorSchema.virtual('dod_formatted').get(function () {
  return this.date_of_death
    ? moment(this.date_of_death).format('MMMM Do YYYY')
    : '';
});

// Virtual for Author's lifespan
AuthorSchema.virtual('lifespan').get(function () {
  let lifeSpan = null;
  if (this.date_of_death && this.date_of_birth) {
    lifeSpan = (
      this.date_of_death.getYear() - this.date_of_birth.getYear()
    ).toString();
  } else if (!this.date_of_death && this.date_of_birth) {
    lifeSpan = (new Date().getYear() - this.date_of_birth.getYear()).toString();
  }
  return lifeSpan;
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(function () {
  return `/catalog/author/${this._id}`;
});

module.exports = mongoose.model('Author', AuthorSchema);
