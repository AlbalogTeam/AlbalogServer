import mongoose from 'mongoose';

const shiftSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Employee',
  },
});

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
