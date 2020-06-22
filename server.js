const http = require('http')
require('dotenv').config()
const app = require('./app')

require('./db')


const PORT = process.env.PORT | 3000

app.listen(PORT, () => {
    console.log(`app is running on port : ${PORT}`)
})

http.createServer(app)
