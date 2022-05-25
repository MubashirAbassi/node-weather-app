const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geoCode = require('./utils/geocode')
const getForecast = require('./utils/forecast')



const app = express()
let port = process.env.PORT || 3000                  //first for heroku or use port 3000


// paths for express config
const publicDir = path.join(__dirname , '../public') //setting path to html file directory
const views_location = path.join(__dirname , '../templates/views')
const partials_location = path.join(__dirname, '../templates/partials')


// set up handlebars and views locations
app.set('view engine', 'hbs')
app.set('views', views_location) //changing default folder directory of views to custom name (templates/views)
hbs.registerPartials(partials_location)


// set up static directory to serve
app.use(express.static(publicDir))


app.get('', (req, res) => {
    res.render('index', {
        name : 'Mubusher Munsif',
        title : 'Weather App',
        desc : 'USE This App to Get your WEATHER!'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        name: "Mubusher Munsif",
        title : 'HBS Data Randering in ABOUT page'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title : 'HBS data rendering in HELP page',
        name : 'Mubusher Munsif',
        description : 'This is the full description of this page'
    })
})

app.get('/weather', (req, res) => {
    let address = req.query.search           //?search in address bar
    if(!address){              //means if search in address is empty
        return res.send({
            error : 'Address must be provided'
        })
    }

    geoCode(address, (error, data) => {
        if(error){
            return res.send({ error : error })
        }

        getForecast(data.latitude, data.longitude, (error, forcastData) => {
            if (error) {
                return res.send({ error : error })
            }
            
            res.send({   
                location : data.location,      //from geocode
                forecast : forcastData.temperature,
                forecastDesc : forcastData.desc,
                address : address               //user input
            })
        })
    })
    
})


app.get('/help/*', (req, res) => {
    res.render('not-found', {
        errorMsg : 'Help Article Not Found!'
    })
})

app.get('*', (req, res) => {
    res.render('not-found', {
        errorMsg : 'Page Not Found!'
    })
})



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


