const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');

router.get('/', (req, res) => {
    res.render('facultyprof', {
        profileimgsrc: 'images/profiledefault.jfif',
        title_top:'faculty Profile',
        user: {
            imgUrl: '/images/person.jpg',
            name: 'Manish Kumar',
            email: 'manish@gmail.com'
        }
    })
})

module.exports = router