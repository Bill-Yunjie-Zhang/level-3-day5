const airportsData = require("airport-data")
const citiesData = require("all-the-cities")
const _ = require("lodash")
const axios = require('axios')

// console.log(airportsData, citiesData)
// console.log(citiesData)

const distance = function (lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

// const checkAirports = function(city){
//     const city1 = citiesData.find(e => e.name === city)
//     // console.log(city1)

//     const distances = airportsData.map(function(o){
//         let d = {
//             name: o.name,
//             // city: o.city,
//             distance: distance(o.latitude, o.longitude, city1.lat, city1.lon, "K")
//         }
//         return d
//     })

//     let sorted = _.sortBy(distances, "distance")
//     return sorted[0]
// }

// // console.log(checkAirports("Chengdu"))

// var scores = [1,2,3,4]
// var updatedScores1 = scores.map(function(num){
//     return num + 1
// })
// console.log(updatedScores1)

const checkAirports = function(city){
    const city1 = citiesData.find(e => e.name === city)
    // console.log(city1)

    const distances = airportsData.map(function(o){
        let d = {
            name: o.name,
            lat: o.latitude,
            lon: o.longitude,
            // city: o.city,
            distance: distance(o.latitude, o.longitude, city1.lat, city1.lon, "K")
        }
        return d
    })

    let sorted = _.sortBy(distances, "distance")

    // return sorted.slice(0,10)
    return sorted[0]
}

const checkAirportsWeather = function(city, unit){
    const airportData = checkAirports(city)
    axios.get("https://api.openweathermap.org/data/2.5/weather?lat=" + airportData.lat + "&lon=" + airportData.lon + "&appid=eda439d629165a345559e6e9043cf085&units=" + unit)
        .then(function(response){
            // console.log(response);
            const data = response.data
            // console.log("main", data)
            const main = data.main
            const temp = main.temp
            console.log('The weather at "' + airportData.name + '" is ' + temp + "F")
        })
        .catch(function (error) {
            // console.log(error)
        })
}
// console.log(checkAirports("Chengdu"))
checkAirportsWeather("Chengdu", "imperial")