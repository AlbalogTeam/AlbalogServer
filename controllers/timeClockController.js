import Location from '../models/location/location';
import Employee from '../models/user/employee';
import moment from 'moment';

const startWork = async (req, res) => {
  const { locationId, start_time, wage } = req.body;

  try {

    const employee = await Location.checkIfUserBelongsToLocation(locationId, req.staff._id);

    const timeClock = { start_time, wage };

    if (!timeClock) {
      res.status(500).send({
        message: 'Cannot Create TimeClock',
      });
      return;
    }

    employee.timeClocks.push(timeClock);
    const result = await employee.save();

    res.status(201).send(
      result.timeClocks[result.timeClocks.length-1]
    );
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

const endWork = async (req, res) => {
  const { locationId, timeClockId, end_time } = req.body;

  try {
    const employee = await Location.checkIfUserBelongsToLocation(locationId, req.staff._id);

    const timeClocks = employee.timeClocks;

    let updatedTimeClock;
    for(let timeClock of timeClocks) {
      if(timeClock._id.toString() === timeClockId) {
        updatedTimeClock = timeClock;
        const start = timeClock.start_time;
        const end = moment(end_time).format();

        if(moment(start).isAfter(end)) {
          throw new Error("잘못된 퇴근 정보입니다.");
        }

        timeClock.total = moment.duration(moment(end_time).diff(start)).asMinutes()*145;

        !timeClock.end_time
            ? (timeClock.end_time = end_time)
            : res.status(500).send({ message: '이미 퇴근 처리가 완료되었습니다.' });

        break;
      }
    }

    if (!updatedTimeClock) {
      res.status(500).send({
        message: '출근하지 않으셨습니다.',
      });
    }

    await employee.save();

    res.status(201).send(
      updatedTimeClock
    );
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

const readTimeClockForStaff = async (req, res) => {

  const { locationId } = req.params;
  const { year, month } = req.body;

  try {
    const location = await Location.findOne({
      _id: locationId,
      'employees.employee': req.staff._id,
    });

    if (!location) {
      throw new Error("해당 매장 정보를 찾을수 없습니다.");
    }

    const staff = await Employee.findOne({
      _id: req.staff._id,
    });

    const timeClocks = staff.timeClocks;

    const finalClocks = timeClocks.filter(v =>
      (moment(v.start_time, 'YYYY/MM/DD').format('M').toString() === month
        && moment(v.start_time, 'YYYY/MM/DD').format('YYYY').toString() === year));
    let sum = 0;
    console.log(finalClocks);
    finalClocks.map(v => {
      sum+=v.total;
    })

    if (!timeClocks.length) {
      throw new Error("아직 근무하시지 않으셨습니다.");
    }

    res.status(201).send({
      finalClocks,
      monthWage: sum
    });
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

const readTimeClockForOwner = async (req, res) => {
  if (!req.owner) {
    res.status(500).send({
      message: 'You are not Owner',
    });
  }

  const { locationId } = req.params;
  const { year, month } = req.body;

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
      const employee = await Employee.findById( employees[i].employee );
      const timeClocks = employee.timeClocks;

      const finalClocks = timeClocks.filter(v =>
        (moment(v.start_time, 'YYYY/MM/DD').format('M').toString() === month
          && moment(v.start_time, 'YYYY/MM/DD').format('YYYY').toString() === year));
      let sum = 0;
      finalClocks.map(v => {
        sum+=v.total;
      })
      allTimeClocks.push({
        name: employee.name,
        timeClocks: finalClocks,
        monthWage: sum
      });
    }

    if (!allTimeClocks.length) {
      res.status(500).send({
        message: '아직 직원이 없습니다.',
      });
    }

    res.status(201).send(
      allTimeClocks,
    );
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

const updateStartTime = async (req, res) => {

  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const {locationId} = req.params;
    const { timeClockId, startTime, staffId } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const staff = await Employee.findById(staffId);

    const timeClocks = staff.timeClocks;

    let originTimeClock;
    for (let timeClock of timeClocks) {
      if (timeClock._id.toString() === timeClockId) {
        originTimeClock = timeClock;
        timeClock.start_time = startTime;
        break;
      }
    }

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

    const {locationId} = req.params;
    const { timeClockId, endTime, staffId } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const staff = await Employee.findById(staffId);

    const timeClocks = staff.timeClocks;

    let originTimeClock;
    for (let timeClock of timeClocks) {
      if (timeClock._id.toString() === timeClockId) {
        originTimeClock = timeClock;
        timeClock.end_time = endTime;
        break;
      }
    }

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


    const { locationId } = req.params;
    const { timeClockId, staffId } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      throw new Error("해당 매장 정보를 찾을 수 없습니다.");
    }

    const staff = await Employee.findById(staffId);

    const timeClocks = staff.timeClocks;

    let deletedTimeClock;
    for (let idx in timeClocks) {
      const id = timeClocks[idx]._id;
      if (id.equals(timeClockId)) {
        deletedTimeClock = timeClocks[idx];
        timeClocks.remove(idx);
        break;
      }
    }

    if (!deletedTimeClock) {
      res.status(500).send({
        message: 'Cannot Delete TimeClock',
      });
      return;
    }

    await staff.save();

    res.status(201).send({
      deletedTimeClock: deletedTimeClock,
    });
  } catch (err) {
    res.status(500).send(err.toString());
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
