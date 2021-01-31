const mongoose = require('mongoose');

const { Schema } = mongoose;

const BorrowerSchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100 },
  mobileNumber: { type: String, required: true, min: 10, max: 10 },
  address: { type: String, required: true },
});

// Virtual for url
BorrowerSchema.virtual('url').get(function getUrl() {
  return `/borrower/${this._id}`;
});

module.exports = mongoose.model('Borrower', BorrowerSchema);
