import Location from '../models/location/location';
import Employee from '../models/user/employee';
import Shift from '../models/schedule/shift';
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

    const datesArr = getBetweenDates(startDate, endDate, staffId, 1, time);

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

module.exports = {
  create_shift,
  get_shifts,
};
