const countryList = document.getElementById('country')
const cityList = document.getElementById('city')
const tempEl = document.getElementsByClassName('temp')
const cloudsEl = document.getElementsByClassName('clouds')
const windEl = document.getElementsByClassName('wind')
const pressureEl = document.getElementsByClassName('pressure')
const degree = '\&#xb0'

const req = new XMLHttpRequest() // Country & city list
req.open("GET", 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json')
req.send()
req.addEventListener('load', function () {
    if (req.status === 200) {
        let respondedData = JSON.parse(req.response)
        listCountries(respondedData)
        listCities(respondedData)
        countryList.onchange = function () {
            listCities(respondedData)
        }
    } else {
        console.log("Unexpected error ", req.status)
    }
})

cityList.addEventListener('change', function(){
    getForecast(1)
})

function listCountries(options){
    let countries = [], sortedCountries = []
    console.log('opt', options)
    countries = Object.keys(options)
    countries.sort()
    console.log(countries)
    for(let i=0; i < countries.length; i++){
        let country = {}
        country[countries[i]] = options[countries[i]].sort()
        sortedCountries.push(country)
        let option = document.createElement('option')
        option.value = countries[i]
        option.textContent = countries[i]
        countryList.appendChild(option)
    }
}

function listCities(respondedData){
    let currentCountry = countryList.value
    cityList.innerHTML = ''
    for (let i = 0, country = respondedData[currentCountry]; i < country.length; i++) {
        let option = document.createElement('option')
        option.value = country[i]
        option.textContent = country[i]
        cityList.appendChild(option)
    }
    getForecast()
}

function getForecast(days = 1) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `https://api.openweathermap.org/data/2.5/forecast?q=${cityList.value}&units=metric&APPID=a6e0b53bc1cdd84d8dc5e2c134ba6431`)
    xhr.send()
    xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
            let respondedData = JSON.parse(xhr.responseText)
            console.log(respondedData.list)
            for (let i = 0; i < days; i++) {
                tempEl[i].textContent = ''
                tempEl[i].textContent += ` ${Math.round(respondedData.list[0].main.temp)} \u00B0C`
                cloudsEl[i].textContent = ''
                cloudsEl[i].textContent += ` ${respondedData.list[0].weather[0].description}`
                windEl[i].textContent = ''
                windEl[i].textContent += ` ${Math.round(respondedData.list[0].wind.speed)} m/s`
                pressureEl[i].textContent = ''
                pressureEl[i].textContent += ` ${Math.round(respondedData.list[0].main.pressure)} mbar`
            }
        } else {
            console.log('Unexpected error: ', xhr.status)
        }        
    })
}