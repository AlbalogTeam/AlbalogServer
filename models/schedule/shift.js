import mongoose from 'mongoose';

const shiftSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  day: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Employee',
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Location',
  },
});

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
