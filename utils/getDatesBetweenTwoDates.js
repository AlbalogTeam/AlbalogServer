function dateRange(startDate, endDate, id, steps = 1, day) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  'Fri', 'Sat';

  while (currentDate <= new Date(endDate)) {
    dateArray.push({
      date: new Date(currentDate),
      owner: id,
      time: {
        startTime: new Date(currentDate),
        endTime: new Date(currentDate),
      },
    });
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}

export default dateRange;
// const dates = dateRange('2020-09-27', '2020-10-28');
// console.log(dates);