const express = require('express')
const app = express()
const db = require('./db')


app.set('view engine', 'ejs')
app.use(express.static("public"));

// Handling api routes
const apiRouter = require('./api')
app.use('/api', apiRouter)


// Handling admin router
const adminRouter = require('./admin')
app.use('/', adminRouter)

//Handling googleSignIn
// const googleSignIn = require('./admin/googlesign')
// app.use('/googlesign', googleSignIn)




module.exports = app