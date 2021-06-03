import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    postal_code: {
      type: String,
      required: true,
      trime: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    employees: [
      {
        employee: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Employee',
          unique: true,
        },
      },
    ],
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
    },
    // calendar: {
    //   type: mongoose.Types.ObjectId,
    //   ref: 'Calendar',
    // },
    schedule_changes: [
      {
        schedule_change: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    transitions: [
      {
        transition: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
  },
  { timestamps: true }
);

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
