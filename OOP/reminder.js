class Reminder {
	constructor(msg, ms){
		this.ms = ms
		this.setAlarm()
	}

	setAlarm(){
		let timer = setTimeout(() => {
			
		}, this.ms)
	}
}