const express = require('express')
const db = require('./db')
const bodyParser = require('body-parser');

const app = express()


app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Handling api routes
const apiRouter = require('./api')
app.use('/api', apiRouter)


// Handling admin router
const adminRouter = require('./admin');

app.use('/', adminRouter)

//**************************** */
// TEMPORARY ; NO NEED LATER
app.get('/image', (req, res) => {
    res.send(`<img src="/profile/image?id=1000"/>`)
    // res.render('events', {
    //     title_top: 'image',
    //     url: '/profile/image?id=1000'
    // })
})
//********************************** */
module.exports = app