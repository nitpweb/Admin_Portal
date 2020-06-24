const express = require('express')
const app = express()
const db = require('./db')


app.set('view engine', 'ejs')
app.use(express.static("public"));

// Handling api routes
const apiRouter = require('./api')
app.use('/api', apiRouter)


// Handling admin router
const adminRouter = require('./admin/home')
app.use('/', adminRouter)

//Handling googleSignIn
const googleSignIn = require('./admin/googlesign')
app.use('/googlesign', googleSignIn)

//Handling home
const home = require('./admin/home')
app.use('/home', home)

//Handling notices
const notices = require('./admin/notices')
app.use('/notices', notices)

//Handling events
const events = require('./admin/events')
app.use('/events', events)

//Handling faculty_prof
const faculty_prof = require('./admin/faculty_prof')
app.use('/faculty_prof', faculty_prof)



module.exports = app