const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');

router.get('/', (req, res) => {
    res.render('notices', {
        profileimgsrc: 'images/profiledefault.jfif',
        title_top:'Notices',
        user: {
            imgUrl: '/images/person.jpg',
            name: 'Manish Kumar',
            email: 'manish@gmail.com'
        }
    })
})

module.exports = router