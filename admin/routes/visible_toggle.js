const router = require('express').Router()
var formidable = require('formidable');
const { Notice } = require('../../models/notice');

router.post('/', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields);
        Notice.toggleVisibility(fields.fileid)

        res.status(201).json({msg: 'visibility toggled'})
        // db.find({userId: fields.fileid}, "notices")
        //     .then(notices => {
        //         console.log(notices);
        //         db.update("id", fields.fileid, notices[0].timestamp, "closeDate", "notices")
        //         db.update("id", fields.fileid, notices[0].closeDate, "timestamp", "notices")
        //     })
        //     .catch(err => res.json(err))
    })
})

module.exports = router