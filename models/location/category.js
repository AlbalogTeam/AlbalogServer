const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  locationId: {
    type: mongoose.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
