import Location from '../models/location/location';
import Shift from '../models/schedule/shift';
import Employee from '../models/user/employee';
import getBetweenDates from '../utils/getDatesBetweenTwoDates';

//직원 스케줄 생성
const create_shift = async (req, res) => {
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

//emloyee: get all shifts
const get_shifts = async (req, res) => {
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

//employees: get all shifts for current location
const get_all_shifts = async (req, res) => {
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

const get_daily_scheldule = async (req, res) => {
  const { date } = req.body;
  const { locationId } = req.params;
  try {
    //daily schedule
    const shifts = await Shift.find({ location: locationId, date })
      .sort({
        start: '1',
      })
      .populate('owner', 'name');
    if (shifts.length < 1) res.status(400).send('스케줄이 없습니다');

    const employees = shifts.map((d) => d.owner._id);

    //timeclock
    const timeClock = await Employee.find({ _id: { $in: employees } }).select(
      'timeClocks'
    );

    res.send({ shifts, timeClock, working: [], off: [], etc: [] });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  create_shift,
  get_shifts,
  get_all_shifts,
  get_daily_scheldule,
};
