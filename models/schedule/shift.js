import mongoose from 'mongoose';

const shiftSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
});

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
