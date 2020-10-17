$(document).ready(() => {
  //======================================================================================

  //globals and initial state
  var now = moment();
  var currentHour = now.hour();
  var targetDay = moment();

  //start the app
  initialize(now);

  //function to initialize app at current date
  function initialize(day) {
    setDate(day);
    generateCalendar(day);
  }

  //function to display date at the top of the page
  function setDate(day) {
    var nextDayButton = $(
      "<i class='fas fa-lg fa-caret-right mx-4' id='goNextDay'></i>"
    ).on("click", nextDay);
    var prevDayButton = $(
      "<i class='fas fa-lg fa-caret-left mx-4' id='goPrevDay'></i>"
    ).on("click", prevDay);
    $("#currentDay")
      .text(day.format("dddd, MMM Do YYYY"))
      .append(nextDayButton)
      .prepend(prevDayButton);
  }

  //function to generate calendar
  function generateCalendar(day) {
    //empty out the old schedule
    $("#schedule").empty();
    //get the events for this day
    var thisDaysEvents = getTodaysEvents();
    //loop until the workday is filled
    var startHour = 8; //save the initial start hour
    var hour = 8; //set the hour to be used as a counter (starts same as startHour)
    while (hour < 18) {
      //create a moment for this hour
      var thisRowMoment = moment(
        new Date(day.year(), day.month(), day.date(), hour)
      );
      //set hour display
      var hourString = "";
      hour > 12 ? (hourString = hour - 12 + "PM") : (hourString = hour + "AM");
      if (hour === 0) hourString = "12AM";
      if (hour === 12) hourString = "12PM";
      //create new hour block
      var newHourBlock = $("<div>")
        .addClass("col-2 col-sm-1 hour py-3 text-right")
        .html(`<p>${hourString}</p>`);
      //set class for input block to show past, present, or future
      var timeClass;
      if (thisRowMoment.isBefore(now)) timeClass = "past";
      if (thisRowMoment.isAfter(now)) timeClass = "future";
      if (thisRowMoment.isSame(now, "hour")) timeClass = "present";
      //create new events block
      var newTextArea = $("<textarea>")
        .addClass(`col-8 col-sm-10 ${timeClass}`)
        .val(thisDaysEvents[hour - startHour]);
      //create new save button
      var newSaveButton = $("<div>")
        .addClass("col-2 col-sm-1 saveBtn")
        .attr("data-hour", hour - startHour)
        .html('<i class="fas fa-save py-3"></i>')
        .on("click", saveEvent);
      //create new row and add the blocks
      var newRow = $("<div>")
        .addClass("row time-block")
        .attr("id", `hour_${hour}`)
        .append(newHourBlock)
        .append(newTextArea)
        .append(newSaveButton);
      //append the new row to the schedule
      $("#schedule").append(newRow);
      hour++;
    }
    //focus on the current hour
    if (day.isSame(now)) {
      $(`#hour_${currentHour}`).children("textarea").focus();
    } else {
      $("#hour_8").children("textarea").focus();
      $("#hour_8").children("textarea").blur();
    }
  }

  //event listener to move forward one day
  function nextDay() {
    targetDay = targetDay.add(1, "d");
    initialize(targetDay);
  }

  //event listener to move backward one day
  function prevDay() {
    targetDay = targetDay.subtract(1, "d");
    initialize(targetDay);
  }

  //event listener to save an event to local storage
  function saveEvent(e) {
    //find the index of the hour that was clicked
    var hourIndex = $(e.currentTarget).attr("data-hour");
    //find the text that is stored in the corresponding textarea
    var thisHoursEvent = $(e.currentTarget).siblings("textarea").val();
    //run getTodaysEvents to get an array from storage or an empty array
    var thisDaysEvents = getTodaysEvents();
    //change the event at the corresponding index to the saved event
    thisDaysEvents[hourIndex] = thisHoursEvent;
    //save the new array to storage
    localStorage.setItem(
      targetDay.format("MM DD YYYY"),
      JSON.stringify(thisDaysEvents)
    );
  }

  //function save all events for a given day
  function saveAll() {
    //run getTodaysEvents to get an array from storage or an empty array
    var thisDaysEvents = getTodaysEvents();
    //loop across all text areas and change the appropriate indexed value in the events array
    for (var i = 0; i < $("#schedule").find("textarea").length; i++) {
      thisDaysEvents[i] = $("#schedule").find("textarea")[i].value;
    }
    //save the new array to storage
    localStorage.setItem(
      targetDay.format("MM DD YYYY"),
      JSON.stringify(thisDaysEvents)
    );
  }

  $("#saveAll").on("click", saveAll);

  //function to clear all events for a given day
  function clearAll() {
    //loop across all text areas and change their value to empty strings
    for (var i = 0; i < $("#schedule").find("textarea").length; i++) {
      $("#schedule").find("textarea")[i].value = "";
    }
    //set the corresponding stored array to an empty array
    localStorage.setItem(
      targetDay.format("MM DD YYYY"),
      JSON.stringify(createEmptyArray())
    );
  }

  $("#clearAll").on("click", clearAll);

  //function to create an empty array for events
  function createEmptyArray() {
    var array = [];
    //push empty strings for each text area in the schedule
    for (var i = 0; i < $("#schedule").find("textarea").length; i++) {
      array.push("");
    }
    return array;
  }

  //function to populate the global variable with the target days events
  function getTodaysEvents() {
    var todaysEvents = JSON.parse(
      localStorage.getItem(targetDay.format("MM DD YYYY"))
    );
    return todaysEvents ? todaysEvents : createEmptyArray();
  }

  //===============================================================================================
})



