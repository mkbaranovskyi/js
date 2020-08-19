// Tasks: http://gitlab.a-level.com.ua/gitgod/FrontendLectures/src/master/03StructuresAndEvaluationsLoopsHomeWork.md
// Blue belt

console.log(pyramid(4))

function pyramid(numStrings = 5){
	if(typeof numStrings !== 'number' || !Number.isInteger(numStrings) || numStrings <= 0){
		return null
	}
	
	let str = '',
		stringLength = numStrings * 2 - 1,
		first = last = numStrings - 1

	for(let i = 0; i < numStrings; i++){

		for(let j = 0; j < stringLength; j++){
			if(j >= first && j <= last){
				str += '#'
			} 
			else {
				str += '.'
			}
		}

		str += '\n'
		first --
		last ++		
	}

	return str
}
