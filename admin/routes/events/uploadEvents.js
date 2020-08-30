const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const {Event, Attachment} = require('../../../models/event')

const storage = require('../../../db/storage')


router.post('/', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        if (err) {
            res.send("Parsing Error")
        }
        let title = fields.main_title;
        let open_date = fields.open_date;
        let close_date = fields.close_date;
        let ittr = fields.ittrname;
        let doc_link = fields.reg_form_link;
        let venue = fields.venue;
        console.log(ittr);
        let attatchments = []
        // get all attatchments

        try {
            for (let i = 1; i <= ittr; i++) {
                if (files["filename" + i] == undefined || fields["subtitle" + i] == "") {
                    continue;
                }
                let file = files["filename" + i];
                let url = await storage.uploadFile(file.path, file.type, file.name, file.size);
                let attatchment = new Attachment(fields["subtitle" + i], url);
                // console.log(attatchment)
                attatchments.push(attatchment)
            }
        } catch (error) {
            res.send(error)
        }


        var event_obj = new Event(new Date().getTime(), title, attatchments, req.session.user.id + "", new Date(open_date).getTime(), new Date(close_date).getTime(), venue, doc_link)

        // creating to database
        Event.create(event_obj)
            .then(result => {
                res.redirect('/events')
            })
            .catch(err => {
                res.send("db update error")
            });


    });
})

module.exports = router