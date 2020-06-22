const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');

router.get('/', (req, res) => {
    res.render('index',{})
})

module.exports = router