let eventDates = document.querySelectorAll('#event-date');

for (let i = 0; i < eventDates.length; i++) {
  let date = moment(eventDates[i].innerText);

  let formattedDate = date.format('MMMM Do YYYY, h:mm:ss a');

  eventDates[i].innerText = formattedDate;
}
