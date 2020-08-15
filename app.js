const express = require('express')
const db = require('./db')

const app = express()


app.set('view engine', 'ejs')
app.use(express.static("public"));


// Handling api routes
// const apiRouter = require('./api')
// app.use('/api', apiRouter)


// Handling admin router
const adminRouter = require('./admin')
app.use('/', adminRouter)


module.exports = app