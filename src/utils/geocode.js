let request = require('request')

let geoCode = (address, callback) => {
    
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1IjoibXVidXNoZXIiLCJhIjoiY2wzYml2ZjlnMDgzZDNscDBoZnljcXljMSJ9.qJT0TvgaOvRfl9A_9H3ttQ&limit=1'

    request({ url : url , json : true }, (error, response) => {
        if(error){
            callback('Unable to connect to Location Services!', undefined )
        }
        else if(response.body.features.length === 0){
            callback('Unable to find location, Try another Search!', undefined )
        }
        else {
            callback( undefined , {
                location : response.body.features[0].place_name,
                latitude : response.body.features[0].center[0], 
                longitude : response.body.features[0].center[1],              
            })
        }
    })
}

module.exports = geoCode