import mongoose from 'mongoose';

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
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
