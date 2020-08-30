const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const {Notice, Attachment} = require('../../models/notice') 

const storage = require('../../db/storage')
const session = require('express-session')


router.post('/', (req, res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req,async function (err, fields, files) {
        if(err) {
            res.send("Parsing Error")
        }
        let title = fields.main_title;
        let open_date = fields.open_date;
        let close_date = fields.close_date;
        let ittr = fields.ittrname;
        let important = fields.important;
        console.log(ittr);
        if(important==undefined)
            important = 0;
        else
            important = 1;
        let attatchments = []
        // get all attatchments

        try {
            for (let i = 1; i <= ittr; i++) {
                if (files["filename" + i] == undefined || fields["subtitle" + i]==""){
                    continue;
                }
                let file = files["filename" + i];
                let data = await storage.uploadFile(file.path, file.type, new Date().getTime()+file.name, file.size);
                let url = data.webViewLink
                let attatchment = new Attachment(fields["subtitle"+i], url);
                // console.log(attatchment)
                attatchments.push(attatchment)
            }
        } catch (error) {
            res.send(error)
        }
        

        var notice_obj = new Notice(new Date().getTime() ,title, attatchments, req.session.user.id + "", new Date(open_date).getTime(), new Date(close_date).getTime(), important)
        
        // creating to database
        Notice.create(notice_obj)
            .then(result => {
                res.redirect('/notices')
            })
            .catch(err => {
                res.send("db update error")
            });

        
    });
})

module.exports = router