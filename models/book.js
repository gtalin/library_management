const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema({
  title: { type: String, require: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String },
  // genre: { type: String },
});

BookSchema.virtual('url').get(function makeurl() {
  return `/catalog/book/${this._id}`;
});

module.exports = mongoose.model('Book', BookSchema);
