const fromDateToNum = (string) => new Date(0, 0,0, string.split(':')[0], string.split(':')[1])

const fromNumToDate = (num) => {
	let hours = Math.floor((num % 86400000) / 3600000);
	let minutes = Math.round(((num % 86400000) % 3600000) / 60000);
	minutes === 0
		?  minutes = '00'
		: minutes < 10
			? minutes = '0' + minutes
			: minutes

	return  hours + ':' + minutes;
}

const fillArrayTime = (startTime, endTime) => {
	const length = calculateDifferent(startTime, endTime) - 1
	let times = Array(length).fill(0);

	for(let i = length; i >= 0; i--){
		if(i === length){
			times[i] = timetable[key].endTime
		} else {
			times[i] = fromNumToDate(fromDateToNum(times[i+1]) - fromDateToNum('00:' + timeDiff))
		}
	}

	return times
}

function checkDate(day) {
	const time = new Date().getHours() + ":" + new Date().getMinutes()

	const date = new Date().toLocaleString('ru-RU', {  weekday: 'short' })

	for(key in timetable) {
		if (key.toLowerCase() == day.toLowerCase()) {
			if(key.toLowerCase() === date.toLowerCase()){
				if (fromDateToNum(time) > fromDateToNum(timetable[key].startTime) && fromDateToNum(time) < fromDateToNum(timetable[key].endTime)) {
					return fillArrayTime(time, timetable[key].endTime)
				} else if (fromDateToNum(time) < fromDateToNum(timetable[key].startTime)) {
					return fillArrayTime(timetable[key].startTime, timetable[key].endTime)
				} else if (fromDateToNum(time) > fromDateToNum(timetable[key].endTime)) {
					return []
				}
			}
			else {
				return fillArrayTime(timetable[key].startTime, timetable[key].endTime)
			}
		}
	}
}

let lastTimes = ''

setInterval(() => {

	let times = checkDate(document.querySelector('.ddl-select').value) || []

	if(JSON.stringify(times) !== JSON.stringify(lastTimes)) {
		lastTimes = times
		document.querySelector('.buttons').innerHTML = '<a  class="button selected">ASAP</a>'
		times.map(time => {
			document.querySelector('.buttons').innerHTML += `<a  class="button">${time}</a>`
		})

		initButtons()
	}

}, 1000)

function calculateDifferent(startTime, endTime) {
	const different = (fromDateToNum(endTime) - fromDateToNum(startTime) - 1)/60000;

	return parseInt(different / timeDiff) + 1
}

initButtons()

