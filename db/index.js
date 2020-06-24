const mysql = require('mysql')

const connection = mysql.createConnection({
    host: process.env.DB_HOST | 'localhost',
    port: process.env.DB_PORT | 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect()
console.log('db connection established')

module.exports = connection