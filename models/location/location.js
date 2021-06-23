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
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
            trim: true,
          },
          who_worked: [
              {
                userId: {
                  type: mongoose.Schema.Types.ObjectId,
                  required: true
                },
                name: {
                  type: String,
                  required: true
                },
                completed: {
                  type: Boolean,
                  required: true,
                  default: false
                },
            }
          ],
          modify_person: [
            {
              userId: {
                type: mongoose.Schema.Types.ObjectId,
                required:true
              },
              name: {
                type: String,
                required: true
              }
            }
          ],
        }),
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
              type: mongoose.SchemaTypes.ObjectId,
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

//스태프가 해당매장의 스태프인지 확인
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

//업주가 해당 매장의 주인인지 확인
locationSchema.statics.isValidCreateShift = async (
  locationId,
  ownerId,
  staffId
) => {
  const isValid = await Location.findOne({
    _id: locationId,
    owner: ownerId,
    'employees.employee': mongoose.Types.ObjectId(staffId),
  });
  if (!isValid) return false;
  return true;
};
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
