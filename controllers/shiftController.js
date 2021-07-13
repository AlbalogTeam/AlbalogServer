const moment = require('moment');
const mongoose = require('mongoose');
const Location = require('../models/location/location');
const Shift = require('../models/schedule/shift');
const getBetweenDates = require('../utils/getDatesBetweenTwoDates');

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

    return res.status(201).send(shift);
  } catch (error) {
    return res.status(500).send(error.toString());
  }
};

// emloyee: get all shifts
const getShifts = async (req, res) => {
  const { employeeId } = req.params;
  if (!employeeId || employeeId.length < 1)
    return res.status(400).send('직원 ID가 정확하지 않습니다');
  try {
    const shifts = await Shift.find({ owner: employeeId });
    return res.send(shifts);
  } catch (error) {
    return res.status(500).send(error.toString());
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
        _id: d._id,
        title: d.owner.name,
        start: d.start,
        end: d.end,
      };
      return shiftObj;
    });

    if (!shifts || shifts.length < 1) return res.status(400).send([]);

    return res.send(newShifts);
  } catch (error) {
    return res.status(500).send(error.message);
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
    return res.send(shift);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteAllSchedule = async (req, res) => {
  const { staffId } = req.body;
  const { locationId } = req.params;
  const today = moment().utcOffset(0, true).toDate();

  if (!staffId || !locationId)
    return res
      .status(400)
      .send({ success: false, message: '매장정보와 직원정보가 필요합니다' });

  try {
    const shifts = await Shift.deleteMany({
      owner: staffId,
      location: locationId,
    })
      .where('date')
      .gte(today);
    if (shifts.deletedCount === 0)
      return res.status(400).send({
        success: false,
        message: '삭제 할 일정이 없습니다',
        count: shifts.deletedCount,
      });
    return res.send({ success: true, count: shifts.deletedCount });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getDailySchedule = async (req, res) => {
  const { locationId, date } = req.params;
  const inputDate = moment.utc(date).toDate();
  try {
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

    const working = [];
    const off = [];
    const before = [];
    temp.forEach((v) => {
      const a = v.timeClock
        .filter((value) => Object.keys(value).length !== 0)
        .filter((d) =>
          moment.utc(d.start_time).isSame(moment.utc(date).toDate(), 'day')
        );

      // 출근전
      if (!a.length) before.push({ name: v.name, time: v.schedule });
      // 일하는중
      else if (a[0].start_time && !a[0].end_time)
        working.push({ name: v.name, time: v.schedule });
      // 퇴근
      else if (a[0].start_time && a[0].end_time)
        off.push({ name: v.name, time: a });
    });

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
  deleteAllSchedule,
};
