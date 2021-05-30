import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const employerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error("Password can not contain a word 'password'.");
        }
      },
    },
    stores: [
      {
        location: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    // businessLicense: {
    //   type: String,
    //   default: 0,
    // },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

employerSchema.statics.checkIfEmailExist = async (email) => {
  const employer = await Employer.findOne({ email });
  if (employer) return true;
  return false;
};
const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
