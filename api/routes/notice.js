const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('notice route')
})


module.exports = router