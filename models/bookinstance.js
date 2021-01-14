const mongoose = require('mongoose');

const { Schema } = mongoose;
const moment = require('moment');

const BookInstanceSchema = new Schema({
  id: { type: String, required: true },
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  date_purchased: { type: Date, default: Date.now() },
  // due_back: { type: Date, default: Date.now, required: true },
  // borrower: { type: Schema.Types.ObjectId, ref: 'Borrower' }
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function () {
  return `/catalog/bookinstance/${this._id}`;
});

// Virtual for bookinstance's formatted date
BookInstanceSchema.virtual('date_purchased_formatted').get(
  function formatDate() {
    return moment(this.date_purchased).format('MMMM Do YYYY');
  }
);

// BookInstanceSchema.virtual('due_back_formatted').get(function formatDate() {
//   return moment(this.due_back).format('MMMM Do YYYY');
// });

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
