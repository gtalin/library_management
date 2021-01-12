const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookInstance = require('./bookinstance');

const PublisherSchema = new Schema({
  name: { type: String, require: true },
});

PublisherSchema.virtual('url').get(function makeurl() {
  return `/catalog/publisher/${this._id}`;
});

// method describe to get all books by an author
PublisherSchema.method('getBookCount', function getBookCount() {
  return BookInstance.countDocuments({ publisher: this._id })
    .then((data) => {
      console.log('Number of book instancess: ', data);
      return data;
    })
    .catch(console.log('Some error with the result'));
});

module.exports = mongoose.model('Publisher', PublisherSchema);
