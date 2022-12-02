const fromStrToDate = (string) => {
	let parts = string.match(/(\d+):(\d+) (AM|PM)/);
	let hours = parseInt(parts[1]),
		minutes = parseInt(parts[2]),
		tt = parts[3];
	if (tt === 'PM' && hours < 12) hours += 12;
	return new Date(0, 0,0, hours, minutes)
}

const fromDateToStr = (date) => {
	let hours = null
	let minutes = null

	if(typeof date === "number"){
		hours = Math.floor((date % 86400000) / 3600000);
		minutes = Math.round(((date % 86400000) % 3600000) / 60000);
	} else {
		hours = date.getHours()
		minutes = date.getMinutes()
	}

	minutes === 0
		?  minutes = '00'
		: minutes < 10
			? minutes = '0' + minutes
			: minutes

	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;

	return hours + ':' + minutes + ' ' + ampm;
}

const fillTimes = (startTime, endTime, gap = 0) => {
	const length = calculateDifferent(startTime, endTime) - gap
	let times = Array(length).fill(0);

	for(let i = length; i >= 0; i--){
		if(i === length){
			times[i] = timetable[key].endTime
		} else {
			times[i] = fromDateToStr(fromStrToDate(times[i+1]) - fromStrToDate('00:' + timeDiff + ' AM'))
		}
	}

	return times
}

function checkAndFillDate() {
	const time = new Date().toLocaleTimeString('en-US',  {hour: 'numeric', minute: 'numeric'})

	const date = new Date().toLocaleString('ru-RU', {  weekday: 'short' })

	for(key in timetable) {
		if (key.toLowerCase() === date.toLowerCase()) {

			const startGap = fromStrToDate(fromDateToStr(fromStrToDate(timetable[key].startTime) - fromStrToDate('00:' + timeDiff + ' AM')))

			if (fromStrToDate(time) > startGap && fromStrToDate(time) < fromStrToDate(timetable[key].endTime)) {
				return fillTimes(time, timetable[key].endTime, 1)
			} else if (fromStrToDate(time) < startGap) {
				return fillTimes(timetable[key].startTime, timetable[key].endTime)
			} else if (fromStrToDate(time) > fromStrToDate(timetable[key].endTime)) {
				return []
			}
		}
	}
	return []
}

let lastTimes = ''

setInterval(() => {
	let times = checkAndFillDate() || []

	if(JSON.stringify(times) !== JSON.stringify(lastTimes)) {
		if(JSON.stringify(times) !== '[]') {
			lastTimes = times
			const lastTime = document.querySelector('.button.selected').innerHTML

			document.querySelector('.buttons').innerHTML = `<a  class="button">ASAP</a>`
			times.map(time => {
				document.querySelector('.buttons').innerHTML += `<a  class="button${time === lastTime ? ' selected' : ''}">${time}</a>`
			})

			if (document.querySelector('.button.selected') === null) {
				document.querySelector(".buttons > a:nth-child(1)").classList.add('selected')
			}

			initButtons()

			document.querySelector('.noTime').style.display = 'none'
		} else {
			document.querySelector('.buttons').innerHTML = ''
			document.querySelector('.noTime').style.display = 'block'
		}
	}

}, 1000)

function calculateDifferent(startTime, endTime) {
	const different = (fromStrToDate(endTime) - fromStrToDate(startTime))/60000;

	return parseInt(different / timeDiff)
}

initButtons()