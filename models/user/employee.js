const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

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
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['남성', '여성'],
      required: true,
    },
    hourly_wage: {
      type: Number,
      trim: true,
      default: 8720,
    },
    timeClocks: [
      {
        type: new mongoose.Schema({
          start_time: {
            type: Date,
            required: true,
          },
          end_time: {
            type: Date,
          },
          wage: {
            type: Number,
            required: true,
          },
          total: {
            type: Number,
          },
          totalWorkTime: {
            type: Number,
          },
        }),
      },
    ],
    role: {
      type: String,
      enum: ['staff'],
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
      // 현재 재직상태
      type: String,
      enum: ['재직자', '퇴직자'],
      default: '재직자',
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
  console.log('generate tken');
  const token = jwt.sign(
    {
      _id: employee._id.toString(),
      role: employee.role,
      stores: employee.stores,
    },
    process.env.JWT_SECRET
  );

  employee.tokens = employee.tokens.concat({ token: token });

  await employee.save();

  return token;
};

employeeSchema.statics.checkIfEmailExist = async (email) => {
  const employee = await Employee.findOne({ email });

  if (employee) return true;
  return false;
};

employeeSchema.statics.findByCredentials = async (email, password) => {
  const employee = await Employee.findOne({ email });
  if (!employee) return false;

  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) throw new Error('Invalid Information');

  return employee;
};

employeeSchema.methods.comparePasswords = async function (currentPassword) {
  const employee = this;
  const isMatch = await bcrypt.compare(currentPassword, employee.password);

  return isMatch;
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
