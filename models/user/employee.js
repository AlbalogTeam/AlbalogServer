import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '../config/' });

const employeeSchema = new mongoose.Schema(
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
    birthdate: {
      type: Date,
      required: true,
    },
    cellphone: {
      type: Number,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Man', 'Woman'],
      required: true,
    },
    hourly_wage: {
      type: Number,
      trim: true,
    },
    timeclocks: [
      {
        timeclock: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    shifts: [
      {
        shift: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    role: {
      type: String,
      default: 'staff',
    },
    stores: [
      {
        location: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Location',
        },
      },
    ],
    status: {
      //현재 재직상태
      type: String,
      enum: ['Working', 'Quit', 'Vacation'],
      default: 'Working',
    },
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

employeeSchema.methods.toJSON = function () {
  const employee = this;
  const employeeObject = employee.toObject();

  delete employeeObject.role;
  delete employeeObject.password;
  delete employeeObject.tokens;

  return employeeObject;
};

employeeSchema.methods.generateAuthToken = async function () {
  const employee = this;
  const token = jwt.sign(
    { _id: employee._id.toString(), role: employee.role },
    process.env.JWT_SECRET
  );

  employee.tokens = employee.tokens.concat({ token: token });

  await employee.save();

  return token;
};

employeeSchema.statics.checkIfEmailExist = async (email) => {
  const employee = await employee.findOne({ email });
  if (employee) return true;
  return false;
};

employeeSchema.statics.findByCredentials = async (email, password) => {
  const employee = await Employee.findOne({ email });
  if (!employee) throw new Error('abc');

  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) throw new Error('def');

  return employee;
};

// Hash the password before saving
employeeSchema.pre('save', async function (next) {
  const employee = this;

  if (employee.isModified('password')) {
    employee.password = await bcrypt.hash(employee.password, 8);
  }
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
