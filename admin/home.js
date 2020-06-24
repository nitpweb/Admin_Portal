const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');

router.get('/', (req, res) => {
    res.render('home', {
        profileimgsrc: 'images/profiledefault.jfif',
        title_top:'Home'
    })
})

module.exports = router