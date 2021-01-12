const mongoose = require('mongoose');

const { Schema } = mongoose;

const BorrowerSchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100 },
  mobileNumber: { type: Number, required: true },
  address: { type: String, required: true },
});

// Virtual for url
BorrowerSchema.virtual('url').get(function getUrl() {
  return `/catalog/borrower/${this._id}`;
});

module.exports = mongoose.model('Borrower', BorrowerSchema);
