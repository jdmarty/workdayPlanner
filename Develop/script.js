//globals
var now = moment()
var currentYear = now.year()
var currentHour = now.hour()
var targetDay = moment()

//clear storage
// localStorage.clear();

//start the app
initialize()

//function to initialize app at current date
function initialize() {
    setDate(now);
    generateCalendar(now)
}

//function to display date at the top of the page
function setDate(day) {
    var nextDayButton = $("<i class='fas fa-lg fa-caret-right mx-4' id='goNextDay'></i>")
        .on('click', nextDay);
    var prevDayButton = $("<i class='fas fa-lg fa-caret-left mx-4' id='goPrevDay'></i>")
        .on('click', prevDay)
    $("#currentDay")
      .text(day.format("dddd, MMM Do YYYY"))
      .append(nextDayButton)
      .prepend(prevDayButton);
}

//function to generate calendar
function generateCalendar(day) {
    //empty out the old schedule
    $('#schedule').empty()

    //get the events for this day
    var thisDaysEvents = getTodaysEvents()

    //loop until the workday is filled
    var hour = 8
    while (hour < 18) {
        //create a moment for this hour
        var thisRowMoment = moment(new Date(day.year(), day.month(), day.date(), hour))
        //set hour display
        var hourString = ''
        hour > 12 ? hourString = hour-12 + 'PM' : hourString = hour + 'AM'
        if (hour === 0) hourString = '12AM';
        if (hour === 12) hourString = '12PM';
        //create new hour block
        var newHourBlock = $('<div>')
            .addClass('col-2 col-sm-1 hour py-3 text-right')
            .html(`<p>${hourString}</p>`)
        //create new events block
        var timeClass;
        if (thisRowMoment.isBefore(now)) timeClass = "past";
        if (thisRowMoment.isAfter(now)) timeClass = "future";
        if (thisRowMoment.isSame(now, "hour")) timeClass = "present";
        var newTextArea = $("<textarea>")
            .addClass(`col-8 col-sm-10 ${timeClass}`)
            .val(thisDaysEvents[hour - 8])
        //create new save button
        var newSaveButton = $("<div>")
            .addClass("col-2 col-sm-1 saveBtn")
            .attr("data-hour", hour - 8)
            .html('<i class="fas fa-save py-3"></i>')
            .on("click", saveEvent);
        //create new row and add the blocks
        var newRow = $('<div>')
            .addClass('row time-block text-xs-left text-sm-center')
            .attr('id', `hour_${hour}`)
            .append(newHourBlock)
            .append(newTextArea)
            .append(newSaveButton)
        //append the new row to the schedule
        $('#schedule').append(newRow)
        hour++
    }
    //focus on the current hour
    if (day.isSame(now)) {
        $(`#hour_${currentHour}`).children("textarea").focus();
    } else {
        console.log('here')
        $('#hour_8').children("textarea").focus();
        $('#hour_8').children("textarea").blur();
    }
}

//event listener to move forward one day
function nextDay() {
    targetDay = targetDay.add(1, 'd')
    setDate(targetDay);
    generateCalendar(targetDay);
}

//event listener to move backward one day
function prevDay() {
    targetDay = targetDay.subtract(1, 'd')
    setDate(targetDay);
    generateCalendar(targetDay);
}

//event listener to save an event to local storage
function saveEvent(e) {
    var hourIndex = $(e.currentTarget).attr('data-hour')
    var thisHoursEvent = $(e.currentTarget).siblings('textarea').val();
    var thisDaysEvents = getTodaysEvents();
    thisDaysEvents[hourIndex] = thisHoursEvent
    localStorage.setItem(targetDay.format('MM DD YYYY'), JSON.stringify(thisDaysEvents))
}

//function to create an empty array for events
function createEmptyArray() {
    var array = []
    for (var i=0; i < 10; i++) {
        array.push('')
    }
    return array
}

//function to populate the global variable with the target days events
function getTodaysEvents() {
    var todaysEvents = JSON.parse(localStorage.getItem(targetDay.format('MM DD YYYY')))
    return todaysEvents ? todaysEvents : createEmptyArray()
}
