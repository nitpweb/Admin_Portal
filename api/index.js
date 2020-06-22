const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('api route')
})

const noticeRouter = require('./routes/notice')
router.use('/notice', noticeRouter)


module.exports = router