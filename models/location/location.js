import mongoose from 'mongoose';
import Employee from '../user/employee';

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
      trim: true,
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
          ref: 'Employee',
          default: null,
        },
      },
    ],
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
          type: new mongoose.Schema({
                date: {
                    type: Date,
                    required: true
                },
                description: {
                    type: String,
                    required: true,
                    trim: true
                },
                completed: {
                    type: Boolean,
                    required: true,
                    default: false
                }
          })
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    notices: [
      {
        type: new mongoose.Schema(
          {
            title: {
              type: String,
              maxLength: 50,
              required: true,
            },
            content: {
              type: String,
              required: true,
            },
          },
          { timestamps: true }
        ),
      },
    ],
    workManuals: [
      {
        type: new mongoose.Schema(
          {
            title: {
              type: String,
              maxLength: 50,
              required: true,
            },
            content: {
              type: String,
              required: true,
            },
            category_id: {
              type: mongoose.Types.ObjectId,
              ref: 'Category',
            },
          },
          { timestamps: true }
        ),
      },
    ],
  },
  { timestamps: true }
);

locationSchema.statics.checkIfUserBelongsToLocation = async (
  locationId,
  staffId
) => {
  const location = await Location.findById(locationId);
  const staffIds = location.employees.map((empId) => empId.employee);

  if (staffIds.includes(staffId)) {
    return await Employee.findById(staffId);
  }
  return false;
};

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
