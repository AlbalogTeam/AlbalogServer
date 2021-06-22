function dateRange(startDate, endDate, id, steps = 1, time) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    time.map((d) => {
      if (currentDate.getUTCDay() === d.day) {
        dateArray.push({
          date: new Date(currentDate),
          start_time: new Date(currentDate),
          end_time: new Date(currentDate),
          owner: id,
        });
        currentDate.setUTCDate(currentDate.getUTCDate() + steps);
      }
    });

    // Use UTC date to prevent problems with time zones and DST
  }

  return dateArray;
}

export default dateRange;
