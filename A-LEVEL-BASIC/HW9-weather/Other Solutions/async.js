'use strict'

const countryListElement = document.getElementById('countries')
const cityListElement = document.getElementById('cities')

const weatherEl = document.getElementsByClassName('weather-output')[0]
const tempEl = document.getElementsByClassName('temp')[0]
const cloudsEl = document.getElementsByClassName('clouds')[0]
const windEl = document.getElementsByClassName('wind')[0]
const pressureEl = document.getElementsByClassName('pressure')[0]

let countriesAndCitiesData

window.onload = () => getCountriesAndCities()

countryListElement.addEventListener('change', () => {
    listCities(countriesAndCitiesData[countryListElement.value])
})

cityListElement.addEventListener('change', function(){
    getForecast(cityListElement.value)
})


async function getCountriesAndCities() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json')
        if (!response.ok) {
            throw new Error('The countrylist request not ok!')
        }
        const countriesData = await response.json()
        countriesAndCitiesData = countriesData
        listCountries(countriesAndCitiesData)

    } catch (err) {
        console.warn(err)
    }
}


function listCountries(data){
	const countryList = Object.keys(data).sort()
	countryList.shift()

	countryListElement.innerHTML = ''

	countryList.forEach(countryName => {
		const option = document.createElement('option')
		countryListElement.append(option)
		option.value = countryName
		option.textContent = countryName
	})

	countryListElement.dispatchEvent(new Event('change'))
}


function listCities(cities){
	cities.sort()

	cityListElement.innerHTML = ''

	cities.forEach(cityName => {
		const option = document.createElement('option')
		cityListElement.append(option)
		option.value = cityName
		option.textContent = cityName
	})

	cityListElement.dispatchEvent(new Event('change'))
}


async function getForecast(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=a6e0b53bc1cdd84d8dc5e2c134ba6431`)
        if (!response.ok) {
            throw new Error('The forecast request is not ok!')
        }
        const weatherData = await response.json()
        renderForecast(weatherData)

    } catch (err) {
        console.warn(err)
        renderForecast(null)
    }
}


function renderForecast(weatherData){
	if(weatherData === null){
		tempEl.textContent = cloudsEl.textContent = windEl.textContent = pressureEl.textContent = ` No data available`
		return
	}

	tempEl.textContent = ` ${Math.round(weatherData.list[0].main.temp)} \u00B0C`
	cloudsEl.textContent = ` ${weatherData.list[0].weather[0].description}`
	windEl.textContent = ` ${Math.round(weatherData.list[0].wind.speed)} m/s`
	pressureEl.textContent = ` ${Math.round(weatherData.list[0].main.pressure)} mbar`
}