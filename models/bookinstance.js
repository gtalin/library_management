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
  date_purchased: { type: Date, default: () => new Date() },
  date_borrowed: { type: Date },
  // due_back: {
  //   type: Date,
  //   default: () =>
  //     this.date_borrowed
  //       ? new Date(+this.date_borrowed + 14 * 24 * 60 * 60 * 1000)
  //       : undefined,
  // },
  borrower: { type: Schema.Types.ObjectId, ref: 'Borrower' },
});

// Virtual for bookinstance's URL
// Virtual field is not working when we're doing aggregate query
BookInstanceSchema.virtual('url').get(function makeurl() {
  return `/catalog/bookinstance/${this._id}`;
});

// Virtual for bookinstance's formatted date
BookInstanceSchema.virtual('date_purchased_formatted').get(
  function formatDate() {
    return moment(this.date_purchased).format('MMMM Do YYYY');
  }
);

BookInstanceSchema.virtual('date_borrowed_formatted').get(
  function formatDate() {
    return moment(this.date_borrowed).format('MMMM Do YYYY');
  }
);

BookInstanceSchema.virtual('dueBack').get(function dueBack() {
  // Add 14 days to the date_borrowed
  const dueBackDate = new Date(+this.date_borrowed + 14 * 24 * 60 * 60 * 1000);
  return moment(dueBackDate).format('MMMM Do YYYY');
});

// BookInstanceSchema.virtual('due_back_formatted').get(function formatDate() {
//   return moment(this.due_back).format('MMMM Do YYYY');
// });

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
