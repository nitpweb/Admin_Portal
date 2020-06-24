const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');

router.get('/', (req, res) => {
    res.render('events', {
        profileimgsrc: 'images/profiledefault.jfif',
        title_top:'events',
        user: {
            imgUrl: '/images/person.jpg',
            name: 'Manish Kumar',
            email: 'manish@gmail.com'
        }
    })
})

module.exports = router