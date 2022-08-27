const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geoCode = require('./utils/geocode')
const getForecast = require('./utils/forecast')
let bodyparser = require('body-parser')
var WiFiControl = require('wifi-control');
const QRCode = require('qrcode')





const app = express()
let port = process.env.PORT || 3000                  //first for heroku or use port 3000


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended : true}))

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

app.post('/qrcode', async(req, res)=>{

    let{ name , email , phoneNumber } = req.body

    console.log('name :' + name)
    console.log('email :' + email)
    console.log('phoneNumber :' + phoneNumber)

    
    WiFiControl.init({
        debug: true
    });

    WiFiControl.scanForWiFi( function(err, response) {
        if (err) console.log(err);
    });

    var settings = {
        debug: true || false,
        iface: 'wlan',
    };
    
    WiFiControl.init( settings );

    WiFiControl.configure( settings );

    await WiFiControl.scanForWiFi( function(err, response) {
        if (err) console.log(err);
    });

    var _ap = {
        ssid: "MubusherdY`OdY`O",
        password: "snooker123"
      };
      var results = await WiFiControl.connectToAP( _ap, function(err, response) {
        if (err) console.log(err);
        console.log(response);
        res.render('about',{
            message : 'User connected Successfully'
        })
      });
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
        description : 'This is the full description of this page',
        country : 'Pakistan',
        age : 24
    })
})

app.get('/qr', async (req, res) => {
    try{
        console.log(await QRCode.toDataURL("https://localhost:3000/about"))
    }catch{
        console.log(err)
    }
    res.render('qr',{
        msg : "qr page randered"
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


