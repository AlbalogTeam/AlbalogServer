import moment from 'moment';
import mongoose from 'mongoose';
import Location from '../models/location/location';
import Shift from '../models/schedule/shift';
import Employee from '../models/user/employee';
import getBetweenDates from '../utils/getDatesBetweenTwoDates';

// 직원 스케줄 생성
const createShift = async (req, res) => {
  const { locationId } = req.params;
  const { staffId, startDate, endDate, time } = req.body;

  if (!req.owner) return res.status(400).send('관리자 권한이 없습니다');

  try {
    const isValid = await Location.isValidCreateShift(
      locationId,
      req.owner._id,
      staffId
    );
    if (!isValid) return res.status(400).send('권한이 없습니다');

    const datesArr = await getBetweenDates(
      startDate,
      endDate,
      staffId,
      locationId,
      1,
      time
    );

    const shift = await Shift.insertMany(datesArr);

    res.status(201).send(shift);

    // res.status(201).send(datesArr);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

// emloyee: get all shifts
const getShifts = async (req, res) => {
  const { employeeId } = req.params;
  if (!employeeId || employeeId.length < 1)
    return res.status(400).send('직원 ID가 정확하지 않습니다');
  try {
    const shifts = await Shift.find({ owner: employeeId });
    res.send(shifts);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

// employees: get all shifts for current location
const getAllShifts = async (req, res) => {
  const { locationId } = req.params;
  if (!locationId) return res.status(400).json('매장 정보가 없습니다');

  try {
    const shifts = await Shift.find({ location: locationId }).populate(
      'owner',
      'name'
    );

    const newShifts = shifts.map((d) => {
      const shiftObj = {
        title: d.owner.name,
        start: d.start,
        end: d.end,
      };
      return shiftObj;
    });

    if (!shifts || shifts.length < 1) return res.status(400).send([]);

    res.send(newShifts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteSchedule = async (req, res) => {
  const { shiftId, staffId } = req.body;
  const { locationId } = req.params;

  try {
    const shift = await Shift.findOneAndRemove({
      _id: shiftId,
      owner: staffId,
      location: locationId,
    });
    if (!shift)
      return res
        .status(400)
        .send({ success: false, message: '해당 스케줄을 삭제 할 수 없습니다' });
    res.send(shift);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getDailySchedule = async (req, res) => {
  const { locationId, date } = req.params;
  const inputDate = moment.utc(date).toDate();
  try {
    // daily schedule
    // const shifts = await Shift.find({ location: locationId, date })
    //   .sort({
    //     start: '1',
    //   })
    //   .populate('owner');
    // if (shifts.length < 1) return res.status(400).send('스케줄이 없습니다');

    // const employees = shifts.map((d) => d.owner._id);

    const temp = await Shift.aggregate([
      {
        $match: {
          location: mongoose.Types.ObjectId(locationId),
          date: inputDate,
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerObj',
        },
      },
      {
        $unwind: '$ownerObj',
      },
      {
        $unwind: {
          path: '$ownerObj.timeClocks',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $expr: {
            $eq: [
              {
                $dateFromParts: {
                  year: { $year: '$start' },
                  month: { $month: '$start' },
                  day: { $dayOfMonth: '$start' },
                },
              },
              inputDate,
            ],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$ownerObj.name' },
          schedule: {
            $first: {
              start: '$start',
              end: '$end',
            },
          },
          timeClock: {
            $push: {
              start_time: '$ownerObj.timeClocks.start_time',
              end_time: '$ownerObj.timeClocks.end_time',
            },
          },
        },
      },
    ]);

    // const temp = await Employee.aggregate([
    //   {
    //     $unwind: { path: '$timeClocks', preserveNullAndEmptyArrays: true },
    //   },

    //   {
    //     $match: {
    //       _id: { $in: employees },
    //     },
    //   },
    //   // {
    //   //   $match: {
    //   //     $expr: {
    //   //       $eq: [
    //   //         {
    //   //           $dateFromParts: {
    //   //             year: { $year: '$timeClocks.start_time' },
    //   //             month: { $month: '$timeClocks.start_time' },
    //   //             day: { $dayOfMonth: '$timeClocks.start_time' },
    //   //           },
    //   //         },
    //   //         inputDate,
    //   //       ],
    //   //     },
    //   //   },
    //   // },
    //   {
    //     $group: {
    //       _id: '$_id',
    //       name: { $first: '$name' },
    //       timeClock: {
    //         $push: {
    //           start_time: '$timeClocks.start_time',
    //           end_time: '$timeClocks.end_time',
    //         },
    //       },
    //     },
    //   },
    // ]);

    const working = [];
    const off = [];
    const before = [];
    temp.forEach((v) => {
      const newArray = v.timeClock.filter(
        (value) => Object.keys(value).length !== 0
      );

      const a = newArray.filter((d) =>
        moment.utc(d.start_time).isSame(moment.utc(date).toDate(), 'day')
      );
      // console.log(v.timeClock);
      // 출근전
      if (!a.length) before.push({ name: v.name, time: v.schedule });
      // 일하는중
      else if (a[0].start_time && !a[0].end_time)
        working.push({ name: v.name, time: v.schedule });
      // 퇴근
      else if (a[0].start_time && a[0].end_time)
        off.push({ name: v.name, time: a });
    });
    // console.log(temp);

    res.send({
      before,
      working,
      off,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createShift,
  getShifts,
  getAllShifts,
  getDailySchedule,
  deleteSchedule,
};
