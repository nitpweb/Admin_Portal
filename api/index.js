const router = require('express').Router()
const db = require('../db')
const User = require('../models/user')
router.get('/', (req, res) => {
    db.query(`select * from users`, (err, results, fields) => {
        if(err) {
            User.createTable()
            results = []
        }
        res.json(results)
    })
})


router.get('/create',async (req, res) => {
    const user = new User(21, 'Manish Kumar', 'manish@gmail.com', 'images/profile.png')
    User.create(user)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.json(err)
    })
    
})

router.get('/:id',async (req, res) => {
    const id = req.params.id
    const user = await User.find(id)
    res.json(user)
})

const noticeRouter = require('./routes/notice')

router.use('/notice', noticeRouter)


module.exports = router