//globals
var now = moment()
var currentYear = now.year()
var currentMonth = now.month()
var currentDayOf = now.date()
var currentHour = now.hour()

//function to display todays date at the top of the page
function setDate(day) {
    $("#currentDay")
      .text("Date: " + day.format("dddd, MMM Do YYYY"))
      .append("<i class='fas fa-lg fa-caret-right mx-4'></i>")
      .prepend("<i class='fas fa-lg fa-caret-left mx-4'></i>");
}
setDate(now)

//function to generate calendar
function generateCalendar() {
    var hour = 0
    var thisDay = moment() //will be an input
    while (hour < 24) {
        //create a moment for this hour
        var thisRowMoment = moment(new Date(thisDay.year(), thisDay.month(), thisDay.date(), hour))
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
    console.log($(`#hour_${currentHour}`));
    $(`#hour_${currentHour}`).children('textarea').focus();
}

generateCalendar()
