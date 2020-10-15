//globals
var now = moment()
var currentYear = now.year()
var currentMonth = now.month()
var currentDayOf = now.date()
var currentHour = now.hour()

var otherDay = moment()

//function to display date at the top of the page
function setDate(day) {
    var nextDayButton = $("<i class='fas fa-lg fa-caret-right mx-4 id='goNextDay'></i>")
        .on('click', nextDay);
    var prevDayButton = $("<i class='fas fa-lg fa-caret-left mx-4' id='goPrevDay'></i>")
        .on('click', prevDay)
    $("#currentDay")
      .text(day.format("dddd, MMM Do YYYY"))
      .append(nextDayButton)
      .prepend(prevDayButton);
}
setDate(now)

//function to generate calendar
function generateCalendar(day) {
    $('#schedule').empty()
    var hour = 0
    while (hour < 24) {
        //create a moment for this hour
        var thisRowMoment = moment(new Date(day.year(), day.month(), day.date(), hour))
        //set hour display
        var hourString = ''
        hour > 12 ? hourString = hour-12 + 'PM' : hourString = hour + 'AM'
        if (hour === 0) hourString = '12AM';
        if (hour === 12) hourString = '12PM';
        //set past/present/future
        var timeClass
        if (thisRowMoment.isBefore(now)) timeClass = 'past';
        if (thisRowMoment.isAfter(now)) timeClass = 'future';
        if (thisRowMoment.isSame(now, 'hour')) timeClass = 'present'
        //create and append blocks for hour, time and save
        var newHourBlock = $('<div>')
            .addClass('col-1 hour align-center text-right')
            .html(`<p class='py-3'>${hourString}</p>`)
        var newTextArea = $("<textarea>")
          .addClass(`col-10 ${timeClass}`)
        var newSaveButton = $("<div>")
          .addClass("col-1 saveBtn")
          .html('<i class="fas fa-save py-3"></i>');
        var newRow = $('<div>')
            .addClass('row time-block')
            .attr('id', `hour_${hour}`)
            .append(newHourBlock)
            .append(newTextArea)
            .append(newSaveButton)
        $('#schedule').append(newRow)
        hour++
    }
    //focus on the current hour
    if (day.isSame(now)) {
        $(`#hour_${currentHour}`).children("textarea").focus();
    } else {
        $(`#hour_0`).children("textarea").focus();
        $(`#hour_0`).children("textarea").blur();
    }
}

//event listener to move forward one day
function nextDay() {
    otherDay = otherDay.add(1, 'd')
    generateCalendar(otherDay);
    setDate(otherDay)
}

function prevDay() {
    otherDay = otherDay.subtract(1, 'd')
    generateCalendar(otherDay);
    setDate(otherDay)
}

generateCalendar(now)
