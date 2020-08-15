const router = require('express').Router()
var formidable = require('formidable');
const db = require('../../db')

router.post('/', function (req, res){
     var form = new formidable.IncomingForm();
     form.parse(req, function (err, fields, files) {
        // console.log(typeof(fields.important));
        var important = 1;
        if(fields.important == '0')
            important = 0;
        db.update("id", fields.fileid, important, "important", "notices");
     })
})

module.exports = router