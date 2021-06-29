import Shift from '../models/schedule/shift';
import moment from 'moment';

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

  // const shift = await Shift.find({ owner: staffId, location: locationId });

  // // const scheduledDates = shift.map((d) => d.date.toDateString());

  while (currentDate <= moment.utc(endDate).toDate()) {
    time.forEach((d) => {
      if (d.day !== moment.utc(currentDate).day()) return;

      let day = days.filter((day) => days.indexOf(day) === d.day);

      //utc 0 db
      //server utc 0

      let start_time = moment.utc(currentDate).toDate();
      let end_time = moment.utc(currentDate).toDate();

      // const start_time = new Date(currentDate);
      // const end_time = new Date(currentDate);
      const st = d.start_time.split(':');
      const et = d.end_time.split(':');
      // start_time.setUTCHours(st[0], st[1]);
      // end_time.setUTCHours(et[0], et[1]);
      start_time = moment
        .utc(start_time)
        .add(st[0], 'hours')
        .add(st[1], 'minutes');
      end_time = moment.utc(end_time).add(et[0], 'hours').add(et[1], 'minutes');

      dateArray.push({
        date: moment.utc(currentDate).toDate(),
        day: day[0],
        start: start_time,
        end: end_time,
        owner: staffId,
        location: locationId,
      });
    });
    // Use UTC date to prevent problems with time zones and DST
    // currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    currentDate = moment.utc(currentDate).add(steps, 'days');
  }

  return dateArray;
}

export default dateRange;
