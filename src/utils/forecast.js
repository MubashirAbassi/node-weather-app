let request = require('request')

let getForecast = (long , lat , callback) => {

    const url = 'http://api.weatherstack.com/current?access_key=a395e928f213f0abf2e8b9384e48f5f7&query=' + lat + ',' + long + '&units=m'  

    request({ url : url , json : true}, (error, response) => {
        if(error){
            callback('unable to connect to Weather Services', undefined )
        }
        else if (response.body.error && !response.body.error.info) {
            console.log(response.body.error)
            callback('Something went wrong, try again!', undefined )
        }
        else if (response.body.error.info) {
            callback('usage limit reached. Please upgrade your monthly Subscription Plan', undefined )
        }
        else {
            callback( undefined , {
                 temperature : response.body.current.temperature,
                 desc: response.body.current.weather_descriptions[0]

            })
        }
    })
}

module.exports = getForecast