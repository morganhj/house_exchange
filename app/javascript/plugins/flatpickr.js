
import flatpickr from "flatpickr"
import "flatpickr/dist/themes/material_blue.css"
import rangePlugin from "flatpickr/dist/plugins/rangePlugin"

const initFlatpickr = () => {
  const calendarElement = document.getElementById('home-exchange-dates')

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
    //        const exchangeStartBtn = document.getElementById('exchange-start-btn')
    //        if (exchangeStartBtn) {
    // 			   exchangeStartBtn.disabled = false
    //        }
    //     }
    //   })
    // }

    if (calendarElement) {

      const disable_dates = JSON.parse(calendarElement.dataset.unavailable);
      const startInput = document.getElementById("start")
      const endInput = document.getElementById("end")
      const startForm = document.querySelector('.exchange_start_date')
      const endForm = document.querySelector('.exchange_end_date')


      const toCalendarStart = document.getElementById('to_calendar_start')
      const toCalendarEnd = document.getElementById('to_calendar_end')
      
      toCalendarStart.addEventListener('click', (event) => {
        setTimeout(function() {
          startForm.classList.remove('hide')
          endForm.classList.add('hide')
          toCalendarStart.classList.add('hide')
        }, 200)
        const exchangeStartBtn = document.getElementById('exchange-start-btn')
        if (exchangeStartBtn) {
         exchangeStartBtn.disabled = true
       }
       if (startInput.value != "") {
        toCalendarEnd.classList.remove('hide')
      }
    })

      toCalendarEnd.addEventListener('click', (event) => {
        setTimeout(function() {
          startForm.classList.add('hide')
          endForm.classList.remove('hide')
          toCalendarStart.classList.remove('hide')
        }, 200)
        setTimeout(function() {
          endForm.classList.add('transition')
        }, 300)
        toCalendarEnd.classList.add('hide')
        const exchangeStartBtn = document.getElementById('exchange-start-btn')
        if (endInput.value != "") {
          exchangeStartBtn.disabled = false
        }
      })

      const startCalendar = flatpickr("#start", {
        dateFormat: "Y-m-d",

        minDate: "today",
        disable: disable_dates,
        mode: "single",

        inline: true,

        altInput: false,
        onChange: function(){
          toCalendarEnd.classList.remove('hide')
          endCalendar.set("minDate", startInput.value)
        }
      })

      const endCalendar = flatpickr("#end", {
        dateFormat: "Y-m-d",

        minDate: "today",
        disable: disable_dates,
        mode: "single",

        inline: true,

        altInput: false,
        onChange: function(){
         const exchangeStartBtn = document.getElementById('exchange-start-btn')
         if (exchangeStartBtn) {
           exchangeStartBtn.disabled = false
         }
       }
     })
      endForm.classList.add('hide')
      toCalendarStart.classList.add('hide')
      toCalendarEnd.classList.add('hide')

    }

}

export { initFlatpickr }