const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');

router.get('/', (req, res) => {
    res.render('index', {
        profileimgsrc: 'images/profiledefault.jfif',
        title_top:'Home',
        user: {
            imgUrl: '/images/person.jpg',
            name: 'Manish Kumar',
            email: 'manish@gmail.com'
        }
    })
})

// Handling events route
const eventRouter = require('./routes/events')
router.use('/events', eventRouter)


const noticeRouter = require('./routes/notices')
router.use('/notices', noticeRouter)


const profileRouter = require('./routes/faculty_prof')
router.use('/profile', profileRouter)

module.exports = router