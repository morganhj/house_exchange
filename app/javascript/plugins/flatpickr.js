
import flatpickr from "flatpickr"
import "flatpickr/dist/themes/material_blue.css"
import rangePlugin from "flatpickr/dist/plugins/rangePlugin"


const calendarElement = document.getElementById('venue-booking-dates')

// if (calendarElement) {

//   const disable_dates = JSON.parse(calendarElement.dataset.unavailable);

//   flatpickr("#start", {
//     dateFormat: "Y-m-d",

//     minDate: "today",
//     disable: disable_dates,

//     inline: true,

//     altInput: false,
//     plugins: [new rangePlugin({ input: "#end"})],
//     onValueUpdate: function() {
//       console.log("value update")
//     },
//     onChange: function(){
//         console.log("on change")
//        const bookingStartBtn = document.getElementById('booking-start-btn')
//        if (bookingStartBtn) {
// 			   bookingStartBtn.disabled = false
//        }
//     }
//   })
// }

if (calendarElement) {

  const disable_dates = JSON.parse(calendarElement.dataset.unavailable);
  const startInput = document.getElementById("start")
  const endInput = document.getElementById("end")
  const startForm = document.querySelector('.booking_start_date')
  const endForm = document.querySelector('.booking_end_date')
  const calendarMessage = document.getElementById('calendar-message')

  const toCalendarStart = document.getElementById('to_calendar_start')
  const toCalendarEnd = document.getElementById('to_calendar_end')
  
  toCalendarStart.addEventListener('click', (event) => {
    endForm.classList.remove('transition')
    setTimeout(function() {
      startForm.classList.remove('hide')
      endForm.classList.remove('active')
      toCalendarStart.classList.remove('active')
    }, 200)
    setTimeout(function() {
      startForm.classList.remove('transition')
    }, 300)
    const bookingStartBtn = document.getElementById('booking-start-btn')
    if (bookingStartBtn) {
         bookingStartBtn.disabled = true
       }
    if (startInput.value != "") {
      toCalendarEnd.classList.add('active')
    }
    calendarMessage.innerHTML = `When will the event <strong>start</strong>?`
  })

  toCalendarEnd.addEventListener('click', (event) => {
    startForm.classList.add('transition')
    setTimeout(function() {
      startForm.classList.add('hide')
      endForm.classList.add('active')
      toCalendarStart.classList.add('active')
    }, 200)
    setTimeout(function() {
      endForm.classList.add('transition')
    }, 300)
    toCalendarEnd.classList.remove('active')
    const bookingStartBtn = document.getElementById('booking-start-btn')
    if (endInput.value != "") {
      bookingStartBtn.disabled = false
    }
    calendarMessage.innerHTML = `When will the event <strong>end</strong>?`
  })

  const startCalendar = flatpickr("#start", {
    dateFormat: "Y-m-d H:i",

    minDate: "today",
    disable: disable_dates,
    mode: "single",
    enableTime: true,

    inline: true,

    altInput: false,
    onChange: function(){
        toCalendarEnd.classList.add('active')
        endCalendar.set("minDate", startInput.value)
    }
  })

  const endCalendar = flatpickr("#end", {
    dateFormat: "Y-m-d H:i",

    minDate: "today",
    disable: disable_dates,
    mode: "single",
    enableTime: true,

    inline: true,

    altInput: false,
    onChange: function(){
       const bookingStartBtn = document.getElementById('booking-start-btn')
       if (bookingStartBtn) {
         bookingStartBtn.disabled = false
       }
    }
  })

}
  const startTime = flatpickr("#start-time", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    onChange: function(){
    }
  })