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
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let currentDate = moment.utc(startDate).toDate();

  // const shift = await Shift.find({ owner: staffId, location: locationId });

  // // const scheduledDates = shift.map((d) => d.date.toDateString());
  // // console.log(scheduledDates);

  while (currentDate <= moment.utc(endDate).toDate()) {
    time.forEach((d) => {
      if (d.day !== currentDate.getDay()) return;

      let day = days.filter((day) => days.indexOf(day) === d.day);

      //utc 0 db
      //server utc 0

      //   {
      //     "_id": "60d71987fa83e02c69cfd1ce",
      //     "date": "2021-05-29T00:00:00.000Z",
      //     "day": "Sat",
      //     "start": "2021-05-29T09:00:00.000Z",
      //     "end": "2021-05-29T15:00:00.000Z",
      //     "owner": "60d17fcdd500db0f93a70f77",
      //     "location": "60c856a7a941aa698d77105c",
      //     "__v": 0
      // },

      const start_time = moment.utc(currentDate).toDate();
      const end_time = moment.utc(currentDate).toDate();
      // const start_time = new Date(currentDate);
      // const end_time = new Date(currentDate);
      const st = d.start_time.split(':');
      const et = d.end_time.split(':');
      start_time.setHours(st[0], st[1]);
      end_time.setHours(et[0], et[1]);

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
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

export default dateRange;
