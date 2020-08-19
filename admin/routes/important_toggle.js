const router = require('express').Router()
var formidable = require('formidable');
const db = require('../../db');
const { Notice } = require('../../models/notice');

router.post('/', function (req, res){
     var form = new formidable.IncomingForm();
     form.parse(req, function (err, fields, files) {
        // console.log(typeof(fields.important));
        var important = 1;
        if(fields.important == '0')
            important = 0;
        // db.update("id", fields.fileid, important, "important", "notices");
        Notice.toggleImportance(fields.fileid, important)
            .then(result => {
                res.status(201).json({msg: 'importance toggled'})
            })
            .catch(err => res.status(500).json({err}))
     })
})

module.exports = router