const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const {Notice, Attachment} = require('../../models/notice') 

const storage = require('../../db/storage')



router.post('/',(req, res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var title = fields.main_title;
        var open_date = fields.open_date;
        var close_date = fields.close_date;
        var ittr = fields.ittrname;
        var important = fields.important;
        console.log(open_date);
        if(important==undefined)
            important = 0;
        else
            important = 1;
        var attach = new Attachment([],[])
        var time_as_id = new Date().getTime();
        var notice_obj = new Notice(time_as_id, title, attach, 5, new Date(open_date).getTime(), new Date(close_date).getTime(), important)
        Notice.create(notice_obj);
        console.log(important);
        console.log(ittr);
        for (var i = 1; i <= ittr; i++) {
            var oldPath = files["filename" + i].path;
            var type = files["filename" + i].type;
            storage.uploadFile(oldPath, type, files["filename" + i].name, files["filename" + i].size,i,function(index, link){
                console.log(link);
                Notice.updateAttachments(time_as_id, fields["subtitle" + index], link);
                // if(index == ittr)
                //     res.redirect('/newNotices')
            });
        }
        res.redirect('/newNotices')
    });
})

module.exports = router