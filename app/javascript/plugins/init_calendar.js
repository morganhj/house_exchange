const initCalendar = () => {

	const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	const wdayFull = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"]
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	const calendar = document.querySelector('.calendar-month.active')
	const dayForm = document.getElementById('day-form')
	const venueTimes = document.getElementById('venue-times')
	const timesReset = document.getElementById('times-reset')
	const bookingForm = document.getElementById('booking-form')
	const calendarWrapper = document.getElementById('calendar-wrapper')
	const calendarHeader = document.getElementById('calendar-header')
	
	const aComesBeforeB = (dateA, dateB, hourA, hourB) => {
		let answer = true
		const [ monthA, dayA, yearA ] = dateA.split('/').map((el) => { return Number(el) })
		const [ monthB, dayB, yearB ] = dateB.split('/').map((el) => { return Number(el) })
		
		if (yearA > yearB) {
			answer = false
		} else if (yearA == yearB) {
			if (monthA > monthB) {
				answer = false
			} else if (monthA == monthB) {
				if (dayA > dayB) {
					answer = false
				} else if (dayA == dayB) {
					if (hourA) {
						if (hourA >= hourB) {
							answer = false
						}
					} else {
						answer = false
					}
				}
			}
		}
		return answer
	}

	function insertDayTime(data, id, active) {
		const dayTime = document.getElementById(`${id}-hours`)
		if (dayTime) {
			if (active != "") { 
				dayTime.classList.add(active)
			}
			
		} else {
			let DOMhours = `<div class="day-times ${active}" 
			id="${id}-hours" 
			data-date="${data.day.month}/${data.day.day}/${data.day.year}"
			data-day = "${data.day.day}"
			data-month = "${data.day.month}"
			data-year = "${data.day.year}">`
			data.hours.forEach((hour, index) => {
				let disabled = `disabled`
				if (hour.available) {
					disabled = ``
				}
				DOMhours = DOMhours + `
				<div class="hour rounded text-center font-weight-bolder ${disabled}"
				data-date="${data.day.month}/${data.day.day}/${data.day.year}" 
				data-day="${data.day.day}" 
				data-hour="${hour.hour}"
				data-hour-price="${Number(data.day.hour_price_cents) / 100}"
				>
				<span>${hour.hour}:00</span>
				</div>
				`
			})
			DOMhours = DOMhours + `</div>`
			venueTimes.insertAdjacentHTML('afterbegin', DOMhours)

			venueTimes.classList.add('active')
			venueTimes.parentElement.classList.add('active')
		}
	}

	function fetchDay(id) {
		fetch(`/api/v1/days/${id}`)
		.then(response => response.json())
		.then((data) => {
			insertDayTime(data, id, "active")
		})
	}

	function fetchNextBooking(date, hour) {
		const [ month, day, year ] = date.split('/')
		const result = fetch(`/api/v1/calendars/${calendarWrapper.dataset.id}?year=${year}&month=${month}&day=${day}&hour=${hour}&next_booking=true`)
		.then(response => response.json())
		.then((data) => { 
			if (!data.error) {
				const next_booking = data.next_booking
				const date = `${next_booking.month}/${next_booking.day}/${next_booking.year}`
				document.querySelectorAll('.day').forEach((day) => {
					if (aComesBeforeB(date, day.dataset.date)) {
						day.classList.add('disabled')
					}
				})
				document.querySelectorAll(`.day:not(.disabled)`).forEach((day) => {
					// fetchDay(Number(day.id))
				})
				document.querySelectorAll('.hour:not(.disabled)').forEach((hour) => {
					if (aComesBeforeB(hour.dataset.date, date)) {
					} else if (Number(hour.dataset.hour) > Number(next_booking.hour)) {
						hour.classList.add('disabled')
						
					}
				})

			}
		})
	}
	
	function fetchCalendar(year, month, type) {
		fetch(`/api/v1/calendars/${calendarWrapper.dataset.id}?year=${year}&month=${month}`)
		.then(response => response.json())
		.then((data) => {

			// REMOVE AL ACTIVE MONTHS
			const calendarMonths = document.querySelectorAll('.calendar-month')
			if (calendarMonths) { calendarMonths.forEach((month) => { month.classList.remove('active') }) }
			// ========================================================

			let prevMonth = `<div id="previous-month" class="col-3 text-center"><<</div>`
			let nextMonth = `<div id="next-month" class="col-3 text-center">>></div>`
			if (`${month}/${year}` == data.date_limits.first) {
				prevMonth = `<div id="" class="col-3 text-center"></div>`
			}
			if (`${month}/${year}` == data.date_limits.last) {
				nextMonth = `<div id="" class="col-3 text-center"></div>`
			}
			calendarHeader.innerHTML = `
					${prevMonth}
					<div id="calendar-month" class="col-6 text-center"><strong>${ months[month - 1] } ${year}</strong></div>
					${nextMonth}`

			const calendarMonth = document.getElementById(`${year}/${month}`)
			if (calendarMonth) {
						calendarMonth.classList.add('active')
			} else {

				const calendar = document.querySelector('.calendar-month.active')
				let DOMweekdays = ``
				weekdays.forEach((weekday, index) => {
					DOMweekdays = DOMweekdays + `<div class="weekday d-flex justify-content-center align-items-center">
						<strong class="text-center">${ weekday }</strong>
					</div>`
				})
				let DOMdays = ``
				data.days.forEach((day, index) => {
					let disable = data.day_colors[index]
					if (venueTimes.dataset.stage == 'end') {
						const startDay = bookingForm.dataset.startDay
						if (aComesBeforeB(`${ day.month }/${ day.day }/${ day.year }`, startDay)) {
							disable = `disabled`
						}
					}
					if (venueTimes.dataset.stage == 'submit') {
						const endDay = bookingForm.dataset.endDay
						if (aComesBeforeB(endDay,`${ day.month }/${ day.day }/${ day.year }`)) {
							disable = `disabled`
						}
					}
					DOMdays = DOMdays + `<div 
							class="day d-flex flex-column justify-content-center align-items-center ${ disable }"
							id="${ day.id }"
							data-date="${ day.month }/${ day.day }/${ day.year }"
							data-year="${ day.year }"
							data-month="${ day.month }"
							data-day="${ day.day }"
							data-wday="${ day.wday }"
							data-wNum="${ day.wnum }"
							data-day-price="${ day.day_price_cents }"
							data-hour-price="${ day.hour_price_cents }"
							>
							
								<span class="text-center">${ day.day }</span>
								<span class="d-flex">
									<span class="text-center" style="font-size: 10px; color: rgba(255,0,0, 0.5);">
										${ Math.round(Number(day.day_price_cents)/100) }
									</span>
									<span class="text-center ml-2" style="font-size: 10px; color: rgba(0,0,255, 0.5);">
										[${ Math.round(Number(day.hour_price_cents)/100) }]
									</span>
								</span>
							</div>`
				})
				DOMdays = DOMdays + `</div>`
				
				const DOMmonth = `
					<div id="${year}/${month}" class="calendar-month active" data-year="${year}" data-month="${month}" data-type="${type}">
						${DOMweekdays}
						${DOMdays}
					</div>`
				calendarWrapper.insertAdjacentHTML('beforeend', DOMmonth)
			}
		})
	}

	const handleMouseover = (event) => {
		const ableHours = document.querySelectorAll('.hour:not(.disabled)')
		const hour = event.currentTarget
		ableHours.forEach((hr) => {
			if (Number(hr.dataset.hour) <= Number(hour.dataset.hour)) {
				hr.classList.add('active')
			}
		})
	}

	const handleMouseout = (event) => {
		const ableHours = document.querySelectorAll('.hour:not(.disabled)')
		const hour = event.currentTarget
		ableHours.forEach((hr) => {
			if (Number(hr.dataset.hour) <= Number(hour.dataset.hour)) {
				hr.classList.remove('active')
			}
		})
	}

	
						
	if (calendarHeader) {
		const today = new Date
		fetchCalendar(today.getFullYear(), today.getMonth()+1, calendarHeader.dataset.type)
		window.addEventListener('click', (event) => {
			if (calendarHeader.dataset.type == "host") {
				const days = document.querySelectorAll('.day:not(.disabled)')
				const calendar = document.querySelector('.calendar-month.active')
				const calendarForm = document.getElementById('calendar-form')
				const monthNum = Number(calendar.dataset.month)
				const yearNum = Number(calendar.dataset.year)
				const div = event.target.closest('div')

				if (event.target.id == 'calendar-form-submit') {
					calendarForm.submit()
				}

				// WHEN I CLICK ON PREVIOUS MONTH ( << )
				if (event.target.id == 'previous-month') {
					let month
					let year = yearNum
					if (monthNum == 1) {
						month = 12
						year = yearNum - 1
					} else {
						month = monthNum - 1
					}

					const calendarMonth = document.getElementById(`${year}/${month}`)
					if (calendarMonth) {
						calendarMonth.classList.add('active')
					} else {
						fetchCalendar(year, month, "host")
					}
				}		

				// WHEN I CLICK ON NEXT MONTH ( >> )
				if (event.target.id == 'next-month') {
					let month
					let year = yearNum
					if (monthNum == 12) {
						month = 1
						year = yearNum + 1
					} else {
						month = monthNum + 1
					}
					const calendarMonth = document.getElementById(`${year}/${month}`)
					if (calendarMonth) {
						calendarMonth.classList.add('active')
					} else {
						fetchCalendar(year, month, "host")
					}
				}

				// WHEN I CLICK ON DAY THAT IS NOT DISABLED OR THE CALENDAR FORM
				if (div.classList.contains('day') && !div.classList.contains('disabled') || (event.target.closest('#day-form') == dayForm && dayForm)) {
					if (div.classList.contains('day')) {
						days.forEach((day) => {
							day.classList.remove('active')
						})
						const dayString = `{"type":"day","value":"${div.dataset.day}/${div.dataset.month}/${div.dataset.year}"}`
						const wdayString = `{"type":"weekday","value":"${div.dataset.wday}"}`
						const wdayStringValue = wdayFull[div.dataset.wday]
						const wnumString = `{"type":"weeknum","value":"${div.dataset.wnum}"}`
						const monthString = `{"type":"month","value":"${div.dataset.month}"}`
						const monthStringValue = months[div.dataset.month - 1]
						const csrfToken = document.querySelector('meta[name="csrf-token"]').attributes.content.value;
						if (dayForm) {
							dayForm.innerHTML = `
						<div class="wrapper">
							<form novalidate="novalidate" class="simple_form /venues/${dayForm.dataset.venueId}" action="/venues/${dayForm.dataset.venueId}" accept-charset="UTF-8" data-remote="true" method="post" id="calendar-form">
								<input type="hidden" name="_method" value="patch">
								<input type="hidden" name="authenticity_token" value="${csrfToken}">
		              
		                		<input type="hidden" name="day[option]" value="">
		                		<input type="hidden" name="day[calendar]" value="${calendar.dataset.id}">
		                		<input type="hidden" name="day[month]" value="${div.dataset.month}">
		                		<input type="hidden" name="day[year]" value="${div.dataset.year}">
		                		<div class="row">
		                			<div class="col-7 border-right">
			                			<div class="form-group integer day_day_price">
				                			<label class="integer" for="day_day_price">
				                				Day price:
				                			</label>
				                			<div class="input-group input-group-merge">
					                			<span class="input-group-text only-rounded-left" ><strong>CHF</strong></span>
					                			<input class="form-control numeric integer form-control-prepend" type="number" step="1" name="day[day_price]" id="day_day_price" value="${Number(div.dataset.dayPrice)/100}" style="font-size: 1rem;">
				                			</div>
			                			</div>
			                			<div class="form-group integer day_hour_price active">
				                			<label class="integer" for="day_hour_price">
				                				Hour price:
				                			</label>
				                			<div class="input-group input-group-merge">
					                			<span class="input-group-text only-rounded-left" ><strong>CHF</strong></span>
					                			<input class="form-control numeric integer form-control-prepend" type="number" step="1" name="day[hour_price]" id="day_hour_price" value="${Number(div.dataset.hourPrice)/100}" style="font-size: 1rem;">
				                			</div>
			                			</div>
		                			</div>
		                			<div class="col-5">
				                		<div class="d-flex flex-column justify-content-between h-100">Apply on:
					                		<span>
						                		<input type="radio" value=${dayString} name="day[option]" id="day_option_day">
						                		<label class="collection_radio_buttons" for="day_option_day">Selected day</label>
					                		</span>
					                		<span>
						                		<input type="radio" value=${wdayString} name="day[option]" id="day_option_weekday">
						                		<label class="collection_radio_buttons" for="day_option_weekday">${wdayStringValue}</label>
					                		</span>
					                		<span>
						                		<input type="radio" value=${wnumString} name="day[option]" id="day_option_week">
						                		<label class="collection_radio_buttons" for="day_option_week">Week</label>
					                		</span>
					                		<span>
						                		<input type="radio" value=${monthString} name="day[option]" id="day_option_month">
						                		<label class="collection_radio_buttons" for="day_option_month">${monthStringValue}</label>
					                		</span>
				                		</div>
				                	</div>
		                		</div>
							</form>
							<div class="d-flex pt-3 border-top">
								<button class="btn btn-secondary ml-auto" id="calendar-form-submit">Modify</button>
							</div>
						</div>
						`
						}
						
					}
					
					div.classList.toggle('active')
					if (dayForm) { dayForm.classList.add('active') }
				} else {
					// days.forEach((day) => {
					// 	day.classList.remove('active')
					// })
					// if (dayForm) { dayForm.classList.remove('active') }
				}
			}

			if (calendarHeader.dataset.type == "guest") {
				
				const days = document.querySelectorAll('.day:not(.disabled)')
				const calendar = document.querySelector('.calendar-month.active')
				const monthNum = Number(calendar.dataset.month)
				const yearNum = Number(calendar.dataset.year)
				const div = event.target.closest('div')

				if (event.target.id == 'calendar-form-submit') {
					calendarForm.submit()
				}
				
				if (event.target == timesReset) {
					if (venueTimes) { 
						venueTimes.innerHTML = ``
						venueTimes.dataset.stage = 'start'
						// fetchDay(venueTimes.dataset.selectedDay)
					}
					document.querySelectorAll('.calendar-month').forEach(a => { a.remove() })
					fetchCalendar(today.getFullYear(), today.getMonth()+1, calendarHeader.dataset.type)
					document.getElementById('start-date').innerHTML = ``
					document.getElementById('end-date').innerHTML = ``
					document.getElementById('total-hours').innerHTML = ``
					document.getElementById('total-price').innerHTML = ``
					bookingForm.removeAttribute('data-start-value');
					bookingForm.removeAttribute('data-start-day');

					venueTimes.parentElement.classList.remove('active')
				}

				// WHEN I CLICK ON PREVIOUS MONTH ( << )
				if (event.target.id == 'previous-month') {
					let month
					let year = yearNum
					if (monthNum == 1) {
						month = 12
						year = yearNum - 1
					} else {
						month = monthNum - 1
					}

					fetchCalendar(year, month, "guest")

				}

				// WHEN I CLICK ON NEXT MONTH ( >> )
				if (event.target.id == 'next-month') {
					let month
					let year = yearNum
					if (monthNum == 12) {
						month = 1
						year = yearNum + 1
					} else {
						month = monthNum + 1
					}
					fetchCalendar(year, month, "guest")
				}
				
				if (div.classList.contains('day') && !div.classList.contains('disabled') || (event.target.closest('#venue-times') == venueTimes && venueTimes) || (event.target.closest('#booking-form') == bookingForm && bookingForm)) {

					if (div.classList.contains('day')) {
						days.forEach((day) => {
							day.classList.remove('active')
						})
						const csrfToken = document.querySelector('meta[name="csrf-token"]').attributes.content.value;
						const dayTimes = document.querySelectorAll('.day-times')
						if (dayTimes) { dayTimes.forEach((day) => { day.classList.remove('active') }) }
						const dayHours = document.getElementById(`${div.id}-hours`)
						if (dayHours) {
							dayHours.classList.add('active')
						} else {
							fetchDay(div.id)
						}
						venueTimes.dataset.selectedDay = div.id
						div.classList.toggle('active')
						
					}

					const hours = document.querySelectorAll('.hour')

					if (venueTimes.dataset.stage == "end") {

						if (div.classList.contains('hour') && !div.classList.contains('disabled')) {

							bookingForm.dataset.endDay = div.dataset.date
							let ableHours = document.querySelectorAll('.hour:not(.disabled)')
							for (let hour of ableHours) {
								if (aComesBeforeB(div.dataset.date, hour.dataset.date) || div.dataset.date == hour.dataset.date) {
									if (Number(hour.dataset.hour) > Number(div.dataset.hour)) {
										hour.classList.add('disabled')
									}
								}
							}
							document.querySelectorAll('.day').forEach((day) => {
								if (aComesBeforeB(div.dataset.date, day.dataset.date)) {
									day.classList.add('disabled')
								}
							})
							
							const request = async () => {
								const query = `${[...document.querySelectorAll('.day:not(.disabled)')].map((day)=>{return day.id})}`
								const response = await fetch(`/api/v1/days?ids=${query}`);
								const json = await response.json();
								
								json.days.forEach((data) => {
									insertDayTime(data, data.day.id, "")
								})
								ableHours.forEach((hour) => {
									hour.removeEventListener('mouseover', handleMouseover)
									hour.removeEventListener('mouseout', handleMouseout)
								})
								ableHours = document.querySelectorAll('.hour:not(.disabled)')
								ableHours.forEach((hour) => {
									hour.classList.add('active')
								})
							
								venueTimes.dataset.stage = 'submit'
								const selectedDay = document.querySelector('.day-times.active')
								const endDate = `${selectedDay.dataset.day}/${selectedDay.dataset.month}/${selectedDay.dataset.year} at ${Number(div.dataset.hour) + 1}:00 hs`
								// const endValue = `${selectedDay.dataset.month}/${selectedDay.dataset.day}/${selectedDay.dataset.year} ${Number(div.dataset.hour) + 1}:00`
								// const startDate = document.getElementById('booking_start_date').value
								const selectedHours = document.querySelectorAll('.hour.active')
								let amount = 0
								selectedHours.forEach((hour) => {
									amount = amount + Number(hour.dataset.hourPrice)
								})
								const totalHours = selectedHours.length


								document.getElementById('end-date').insertAdjacentHTML('beforeend', `<span>${endDate}</span>`)
								document.getElementById('booking_end_date').value = endDate
								document.getElementById('booking_amount').value = amount
								document.getElementById('total-hours').insertAdjacentHTML('beforeend', `<span>${totalHours} hs</span>`)
								document.getElementById('total-price').insertAdjacentHTML('beforeend', `<span>CHF ${Math.round((amount + Number.EPSILON) * 100) / 100}</span>`)


							}
							request()
							
						}
					}

					if (venueTimes.dataset.stage == "start") {
						if (div.classList.contains('hour') && !div.classList.contains('disabled')) {
							fetchNextBooking(div.dataset.date, div.dataset.hour)
							const request = async () => {
								const query = `${[...document.querySelectorAll('.day:not(.disabled)')].map((day)=>{return day.id})}`
								const response = await fetch(`/api/v1/days?ids=${query}`);
								const json = await response.json();
								
								json.days.forEach((data) => {
									insertDayTime(data, data.day.id, "")
								})
							
							document.querySelectorAll('.day').forEach((day) => {
								if (aComesBeforeB(day.dataset.date, div.dataset.date)) {
									day.classList.add('disabled')
								}
							})
							for (let hour of hours) {
								// REMOVE ALL ACTIVE HOURS
								hour.classList.remove('active')

								if (!aComesBeforeB(div.dataset.date, hour.dataset.date)) {
									if (Number(hour.dataset.hour) < Number(div.dataset.hour)) {
										hour.classList.add('disabled')
									}
								}
							}
							div.classList.toggle('active')
							venueTimes.dataset.stage = "end"
							const ableHours = document.querySelectorAll('.hour:not(.disabled)')
							ableHours.forEach((hour) => {
								hour.addEventListener('mouseover', handleMouseover )
								hour.addEventListener('mouseout', handleMouseout )
							})
							bookingForm.classList.add('active')
							const selectedDay = document.querySelector('.day-times.active')
							const startDate = `${selectedDay.dataset.day}/${selectedDay.dataset.month}/${selectedDay.dataset.year} at ${div.innerText} hs`
							const startValue = `${selectedDay.dataset.month}/${selectedDay.dataset.day}/${selectedDay.dataset.year} ${div.innerText}`
							
							document.getElementById('start-date').insertAdjacentHTML('beforeend', `<span>${startDate}</span>`)
							document.getElementById('booking_start_date').value = startDate
							bookingForm.dataset.startValue = startValue
							bookingForm.dataset.startDay = div.dataset.date
							}
							request()

						}
					}

				} else {
					// days.forEach((day) => {
					// 	day.classList.remove('active')
					// })
					// if (venueTimes) { 
					// 	venueTimes.classList.remove('active')
					// 	venueTimes.dataset.stage = 'start'
					// }
					// document.getElementById('start-date').innerHTML = ``
					// document.getElementById('end-date').innerHTML = ``
					// document.getElementById('total-hours').innerHTML = ``
					// document.getElementById('total-price').innerHTML = ``
					// bookingForm.classList.remove('active')
				}
			}
		})	
	}
}

export { initCalendar }