//globals
var now = moment()
var currentYear = moment().year()
var currentMonth = moment().month()
var currentDayOf = moment().date()
var currentHour = moment().hour()

//function to display todays date at the top of the page
function setToday() {
    $('#currentDay').text('Today is: '+moment().format('dddd, MMM Do YYYY'))
}
setToday()

//function to generate calendar
function generateCalendar() {
    var hour = 0
    var thisDay = moment() //will be an input
    while (hour < 24) {
        //create a date for this hour
        var thisRowHour = moment(new Date(thisDay.year(), thisDay.month(), thisDay.date(), hour))
        //set hour display
        var hourString = ''
        hour > 12 ? hourString = hour-12 + 'PM' : hourString = hour + 'AM'
        if (hour === 0) hourString = '12AM';
        if (hour === 12) hourString = '12PM';
        //set past/present/future
        var timeClass
        if (thisRowHour.isBefore(now)) timeClass = 'past';
        if (thisRowHour.isAfter(now)) timeClass = 'future';
        if (thisRowHour.isSame(now, 'hour')) timeClass = 'present'
        //create and append blocks for hour, time and save
        var newHourBlock = $('<div>')
            .addClass('col-1 hour align-center text-right')
            .html(`<p class='py-3'>${hourString}</p>`)
        var newTextArea = $('<textarea>')
            .addClass(`col-10 ${timeClass}`)
        var newSaveButton = $('<div>')
            .addClass('col-1 saveBtn')
        var newRow = $('<div>')
            .addClass('row time-block')
            .attr('id', `hour_${hour}`)
            .append(newHourBlock)
            .append(newTextArea)
            .append(newSaveButton)
        $('#schedule').append(newRow)
        //scroll to the current hour
        if (thisRowHour.isSame(now, "hour")) {
            $("#schedule").animate(
                { scrollTop: $(`#hour_${currentHour}`).offset().top, },
                1000
            );
        }
        
        hour++
    }
}

generateCalendar()
