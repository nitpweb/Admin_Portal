const router = require('express').Router()
const db = require('../db')

router.get('/', (req, res) => {
    db.query(`select * from users`, (err, results, fields) => {
        if(err) {
            console.log(err)
            res.status(500).json({err:'db error'})
        }
        res.json(results)
    })
})

const noticeRouter = require('./routes/notice')
router.use('/notice', noticeRouter)


module.exports = router