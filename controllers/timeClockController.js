import Location from '../models/location/location';
import Employee from '../models/user/employee';

//매장 스태프 만들기
const startWork = async (req, res) => {
  const locationId = req.params.locationId;
  const { start_time } = req.body;
  let { wage } = req.body;

  if (!wage) wage = 8720;

  try {
    const location = await Location.findOne({
      locationId,
      'employees.employee': req.staff._id,
    });

    if (!location) {
      return res.status(400).send({ message: '매장정보를 찾을 수 없습니다' });
    }

    const staff = await Employee.findOne({
      _id: req.staff._id,
    });

    const timeClock = { start_time, wage };

    if (!timeClock) {
      res.status(500).send({
        message: 'Cannot Create TimeClock',
      });
    }

    staff.timeClocks.push(timeClock);
    await staff.save();

    res.status(201).send({
      timeClock,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const endWork = async (req, res) => {
  const { locationId, workId } = req.params;
  const { end_time } = req.body;

  try {
    const location = await Location.findOne({
      locationId,
      'employees.employee': req.staff._id,
    });

    if (!location) {
      res.status(400).send({ message: '매장정보를 찾을 수 없습니다' });
    }

    const staff = await Employee.findOne({
      _id: req.staff._id,
    });

    const timeClock = await staff.timeClocks.findOne({ _id: workId });

    if (!timeClock) {
      res.status(500).send({
        message: '출근하지 않으셨습니다.',
      });
    }

    !end_time
      ? (timeClock.end_time = end_time)
      : res.status(500).send({ message: '이미 퇴근 처리가 완료되었습니다.' });

    await staff.save();

    res.status(201).send({
      timeClock,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const readTimeClockForStaff = async (req, res) => {
  const { locationId } = req.params;
  try {
    const location = await Location.findOne({
      _id: locationId,
      'employees.employee': req.staff._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const staff = await Employee.findOne({
      _id: req.staff._id,
    });

    const timeClocks = staff.timeClocks;

    if (!timeClocks.length) {
      res.status(500).send({
        message: '아직 근무 하지 않으셨습니다.',
      });
    }

    res.status(201).send({
      timeClocks,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const readTimeClockForOwner = async (req, res) => {
  if (!req.owner) {
    res.status(500).send({
      message: 'You are not Owner',
    });
  }

  const { locationId } = req.params;

  try {
    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const employees = location.employees;
    const allTimeClocks = [];

    for (let i = 0; i < employees.length; i++) {
      const employee = await Employee.findById({ _id: employees[i]._id });
      allTimeClocks.push({
        id: employees[i]._id,
        timeClocks: employee.timeClocks,
      });
    }

    if (!allTimeClocks.length) {
      res.status(500).send({
        message: '아직 직원이 없습니다.',
      });
    }

    res.status(201).send({
      allTimeClocks,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateStartTime = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const { locationId, clockId } = req.params;
    const { startTime, staffId } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const staff = Employee.findById({ _id: staffId });

    const timeClocks = staff.timeClocks;

    let originTimeClock;
    for (let timeClock of timeClocks) {
      if (timeClock._id.toString() === clockId) {
        originTimeClock = timeClock;
        timeClock.start_time = startTime;
        break;
      }
    }

    await timeClocks.save();
    await staff.save();

    if (!originTimeClock) {
      res.status(500).send({
        message: 'Cannot Update TimeClock',
      });
    }

    res.status(201).send({
      updatedTimeClock: originTimeClock,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const updateEndTime = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const { locationId, clockId } = req.params;
    const { endTime, staffId } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const staff = Employee.findById({ _id: staffId });

    const timeClocks = staff.timeClocks;

    let originTimeClock;
    for (let timeClock of timeClocks) {
      if (timeClock._id.toString() === clockId) {
        originTimeClock = timeClock;
        timeClock.end_time = endTime;
        break;
      }
    }

    await timeClocks.save();
    await staff.save();

    if (!originTimeClock) {
      res.status(500).send({
        message: 'Cannot Update TimeClock',
      });
    }

    res.status(201).send({
      updatedTimeClock: originTimeClock,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const deleteTimeClock = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const { locationId, clockId } = req.params;

    const { staffId } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const staff = Employee.findById({ _id: staffId });

    const timeClocks = staff.timeClocks;

    let deletedTimeClock;
    for (let idx in timeClocks) {
      if (timeClocks[idx]._id.toString() === clockId) {
        deletedTimeClock = timeClocks[idx];
        timeClocks.remove(idx);
        break;
      }
    }

    await timeClocks.save();
    await staff.save();

    if (!deletedTimeClock) {
      res.status(500).send({
        message: 'Cannot Delete TimeClock',
      });
    }

    res.status(201).send({
      deletedTimeClock: deletedTimeClock,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

module.exports = {
  startWork,
  endWork,
  readTimeClockForStaff,
  readTimeClockForOwner,
  updateStartTime,
  updateEndTime,
  deleteTimeClock,
};
