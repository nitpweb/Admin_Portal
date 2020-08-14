const router = require('express').Router()
var formidable = require('formidable');
const db = require('../../db')

router.post('/', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        console.log(fields);
        db.togglesearch(fields.fileid)
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