import Shift from '../models/schedule/shift';

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
  let currentDate = new Date(startDate);

  const shift = await Shift.find({ owner: staffId, location: locationId });

  while (currentDate <= new Date(endDate)) {
    time.forEach((d) => {
      if (d.day !== currentDate.getDay()) return;

      let day = days.filter((day) => days.indexOf(day) === d.day);

      const start_time = new Date(currentDate);
      const end_time = new Date(currentDate);
      const st = d.start_time.split(':');
      const et = d.end_time.split(':');
      start_time.setUTCHours(st[0], st[1]);
      end_time.setUTCHours(et[0], et[1]);

      dateArray.push({
        date: new Date(currentDate),
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
