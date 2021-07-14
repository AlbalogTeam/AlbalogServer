const moment = require('moment');
const Shift = require('../models/schedule/shift');

async function dateRange(
  startDate,
  endDate,
  staffId,
  locationId,
  steps = 1,
  time
) {
  const dateArray = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let currentDate = moment.utc(startDate).toDate();

  while (currentDate <= moment.utc(endDate).toDate()) {
    time.forEach((d) => {
      // 요일이 다르면 리턴
      if (d.day !== moment.utc(currentDate).day()) return;

      const dayArr = days.filter((day) => days.indexOf(day) === d.day);

      let startTime = moment.utc(currentDate).toDate();
      let endTime = moment.utc(currentDate).toDate();

      const st = d.start_time.split(':');
      const et = d.end_time.split(':');

      startTime = moment
        .utc(startTime)
        .add(st[0], 'hours')
        .add(st[1], 'minutes');
      endTime = moment.utc(endTime).add(et[0], 'hours').add(et[1], 'minutes');

      if (startTime >= endTime) {
        endTime = moment.utc(endTime).add(1, 'days');
        console.log(endTime);
      }
      dateArray.push({
        date: moment.utc(currentDate).toDate(),
        day: dayArr[0],
        start: startTime,
        end: endTime,
        owner: staffId,
        location: locationId,
        exists: [],
      });
    });
    // Use UTC date to prevent problems with time zones and DST
    // currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    currentDate = moment.utc(currentDate).add(steps, 'days');
  }

  const shifts = await Shift.find({ owner: staffId, location: locationId });

  const scheduledDates = shifts.map((d) => moment.utc(d.date).toDate());
  if (scheduledDates.length > 0) {
    scheduledDates.forEach((v) => {
      dateArray.forEach((d) => {
        const isScheduledDate = moment(moment.utc(d.date).toDate()).isSame(
          moment.utc(v).toDate()
        );
        if (isScheduledDate) {
          dateArray.splice(dateArray.indexOf(d), 1);
        }
      });
    });
  }

  return dateArray;
}

module.exports = dateRange;
