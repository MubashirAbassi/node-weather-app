console.log('Claint side JS file is up and running')
// fetching data from another api(example)
// fetch('http://puzzle.mead.io/puzzle').then( (response) => {
//     response.json().then( (data) => {
//         console.log(data.puzzle)
//     })
// })




// Real Work: 

//selecting parent elements:
let weatherForm = document.querySelector('.weather-form')
let search_loc = document.querySelector('#search-loc')
let result_div = document.querySelector('#result-div')
let first_para = document.querySelector('#first-para')

//creating new elements:
let locationf = document.createElement('h4')
let tempf = document.createElement('h4')
let descf = document.createElement('h4')


weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    result_div.innerHTML = ''                            //making div empty for each call
    result_div.appendChild(first_para)                   //appending first para again because div is empty now
    first_para.textContent = 'Loading...'
    let location = search_loc.value
    console.log('form submission', location)



    fetch('/weather?search=' + location).then( (response) => {
    response.json().then( (data) => {

        if(data.error){
            console.log(data.error)
            first_para.textContent = 'Error : ' + data.error             //first_para already created in HTML
        } 
        else {
            console.log(data.location)
            console.log(data.forecastDesc, data.forecast)
            console.log(data.address)

            first_para.textContent = 'YOU SEARCHED FOR:  ' + data.address   //first_para already created in HTML
            locationf.textContent = 'LOCATION:  ' + data.location
            tempf.textContent = 'TEMPERATURE:  ' + data.forecast + '°C'
            descf.textContent = 'DESCRIPTION:  ' + data.forecastDesc

            result_div.appendChild(locationf)
            result_div.appendChild(tempf)
            result_div.appendChild(descf)

        }
    })
}) 

})
