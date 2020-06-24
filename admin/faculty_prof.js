const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');

router.get('/', (req, res) => {
    res.render('facultyprof', {
        profileimgsrc: 'images/profiledefault.jfif',
        title_top:'faculty Profile'
    })
})

module.exports = router