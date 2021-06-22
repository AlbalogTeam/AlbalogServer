import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '../config/' });

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
          ref: 'Location',
        },
      },
    ],
    role: {
      type: String,
      enum: ['admin', 'owner'],
      default: 'owner',
    },
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

employerSchema.methods.toJSON = function () {
  const employer = this;
  const employerObject = employer.toObject();

  delete employerObject.role;
  delete employerObject.password;
  delete employerObject.tokens;

  return employerObject;
};

employerSchema.methods.generateAuthToken = async function () {
  const employer = this;
  const token = jwt.sign(
    {
      _id: employer._id.toString(),
      role: employer.role,
    },
    process.env.JWT_SECRET
  );

  employer.tokens = employer.tokens.concat({ token: token });

  await employer.save();

  return token;
};

employerSchema.statics.checkIfEmailExist = async (email) => {
  const employer = await Employer.findOne({ email });
  if (employer) return true;
  return false;
};

employerSchema.methods.comparePasswords = async function (currentPassword) {
  const employer = this;
  const isMatch = await bcrypt.compare(currentPassword, employer.password);

  return isMatch;
};

employerSchema.statics.findByCredentials = async (email, password) => {
  const employer = await Employer.findOne({ email });
  if (!employer) return false;
  // if (!employer) throw new Error('Invalid Information');

  const isMatch = await bcrypt.compare(password, employer.password);
  if (!isMatch) throw new Error('Invalid Information');

  return employer;
};

// Hash the password before saving
employerSchema.pre('save', async function (next) {
  const employer = this;

  if (employer.isModified('password')) {
    employer.password = await bcrypt.hash(employer.password, 8);
  }
  next();
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
