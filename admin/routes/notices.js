const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const db = require("../../db");
const { Attachment,Notice } = require('../../models/notice');


function compare(a, b) {
    const bandA = a.timestamp;
    const bandB = b.timestamp;
    let comparison = 0;
    if (bandA < bandB) {
        comparison = 1;
    } else if (bandA > bandB) {
        comparison = -1;
    }
    return comparison;
}


router.get('/', (req, res) => {
    var user = req.session.user;
    if (user != undefined) {
        db.find({userId:`${user.id}`}, Notice.tableName)
            .then(notices => {
                notices.forEach(notice => {
                    // console.log(notice)
                    notice.attachments = JSON.parse(notice.attachments)
                    const todaydate = new Date().getTime();
                    if(notice.openDate<=todaydate && todaydate<=notice.closeDate){
                        notice.isvisible = 1;
                    }else{
                        notice.isvisible = 0;
                    }
                    var d = new Date(notice.closeDate)
                    notice.closeDate=d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                    var d1= new Date(notice.openDate)
                    notice.openDate = d1.getDate() + '/' + (d1.getMonth() + 1) + '/' + d1.getFullYear();
                })
                notices.sort(compare);
                // console.log(notices);
                res.render('notices', {
                    profileimgsrc: 'images/profiledefault.jfif',
                    title_top: 'Notices',
                    user: {
                        imgUrl: user.imgUrl,
                        name: user.name,
                        email: user.email
                    },
                    Navbar: req.session.Navbar,
                    notices: notices,
                    Drive: req.session.isAdmin
                })
            })
            .catch(err => res.render('notices', {
                profileimgsrc: 'images/profiledefault.jfif',
                title_top: 'Notices',
                user: {
                    imgUrl: user.imgUrl,
                    name: user.name,
                    email: user.email
                },
                Navbar: req.session.Navbar,
                notices: [],
                Drive: req.session.isAdmin
            }))
    } else {
        res.redirect("/login")
    }
})

//for deleting a notice permanetly
router.post('/delete', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var user = req.session.user;
        if (user != undefined) {
            db.find({
                    userId: `${user.id}`
                }, Notice.tableName)
                .then(notices => {
                    notices.forEach(notice => {
                        if (notice.id == fields["file_id"]){
                            Notice.deleteRow(fields["file_id"]);
                            res.redirect('/notices')
                        }
                    })
                }).catch(err =>res.redirect('/notices'))
        }
    })
})

//for editing notice
router.post('/edit', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.send("Parsing Error")
        }
        let title = fields.main_title;
        let open_date = fields.open_date;
        let close_date = fields.close_date;
        let ittr = fields.ittrname;
        let important = fields.important;
        if (important == undefined)
            important = 0;
        else
            important = 1;
        let attachments = []
        for (let i = 1; i <= ittr; i++) {
            let url = fields["link" + i];
            let attachment = new Attachment(fields["subtitle" + i], url);
            attachments.push(attachment)
        }
        console.log(title);
        console.log(open_date);
        console.log(close_date);
        console.log(ittr);
        console.log(important);
        console.log(attachments);

        var user = req.session.user;
        if (user != undefined) {
            db.find({
                    userId: `${user.id}`
                }, Notice.tableName)
                .then(notices => {
                    notices.forEach(notice => {
                         var file_id_here = fields["file_id"];
                        if (notice.id == file_id_here) {
                             var notice_obj = new Notice(file_id_here, title, attachments, req.session.user.id + "", new Date(open_date).getTime(), new Date(close_date).getTime(), important)

                             // updating to database
                             Notice.updateWholeObj(file_id_here, notice_obj)
                                 .then(result => {
                                     res.redirect('/notices')
                                 })
                                 .catch(err => {
                                     res.send("db update error")
                                 });
                        }
                    })
                }).catch(err => res.send("kkj"))
        }
    })
})

router.post('/visible_toggle', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var visible_status = fields.visible_status;
        Notice.toggleVisibility(fields.fileid, visible_status)

        res.status(201).json({
            msg: 'visibility toggled'
        })
    })
})

router.get('/closeDate/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    Notice.findById(id)
        .then(notice => {
            res.send(notice)
        })
        .catch(err => {
            res.send(err)
        })
})

router.post('/important_toggle', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        // console.log(typeof(fields.important));
        var important = 1;
        if (fields.important == '0')
            important = 0;
        // db.update("id", fields.fileid, important, "important", "notices");
        Notice.toggleImportance(fields.fileid, important)
            .then(result => {
                res.status(201).json({
                    msg: 'importance toggled'
                })
            })
            .catch(err => res.status(500).json({
                err
            }))
    })
})

router.get('/filter/:date', (req, res) =>{
    var user = req.session.user;
    // console.log(req.params.date);
    var date_arr = req.params.date;
    var start_date = "";
    var end_date = "";
    var temp_date = "";
    for(var i=0;i<date_arr.length;i++){
        if(date_arr[i] == ','){
            start_date = temp_date;
            temp_date = "";
        }else{
            temp_date += date_arr[i];
        }
    }
    end_date = temp_date;
    console.log(start_date)
    console.log(end_date)
    var notices_filter = [];
    if (user != undefined) {
        db.find({
                userId: `${user.id}`
            }, Notice.tableName)
            .then(notices => {
                notices.forEach(notice => {
                    // console.log(notice)
                    notice.attachments = JSON.parse(notice.attachments)
                    const todaydate = new Date().getTime();
                    if (notice.openDate <= todaydate && todaydate <= notice.closeDate) {
                        notice.isvisible = 1;
                    } else {
                        notice.isvisible = 0;
                    }
                    var d = new Date(notice.closeDate)
                    notice.closeDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                    var d1 = new Date(notice.openDate)
                    notice.openDate = d1.getDate() + '/' + (d1.getMonth() + 1) + '/' + d1.getFullYear();
                    if(notice.timestamp >= new Date(start_date) && notice.timestamp<= new Date(end_date)){
                        notices_filter.push(notice);
                    }
                })
                notices.sort(compare);
                // console.log(notices);
                res.json(notices_filter);
            })
            .catch(err => res.send([]))
    } else {
        res.redirect("/login")
    }
})

module.exports = router