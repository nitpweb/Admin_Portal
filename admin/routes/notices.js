const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const db = require("../../db")


router.get('/', (req, res) => {
    var user = req.session.user;
    if (user != undefined) {
        db.find({userId:`${user.id}`}, "notices")
            .then(notices => {
                notices.forEach(notice => {
                    notice.attachments = JSON.parse(notice.attachments)
                    const todaydate = new Date().getTime();
                    if(notice.openDate<=todaydate && todaydate<=notice.closeDate){
                        notice.isvisible = 1;
                    }else{
                        notice.isvisible = 0;
                    }
                    var d = new Date(notice.closeDate)
                    notice.closeDate=d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                })
                // console.log(notices);
                res.render('notices', {
                    profileimgsrc: 'images/profiledefault.jfif',
                    title_top: 'Notices',
                    user: {
                        imgUrl: user.imageUrl,
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
                    imgUrl: user.imageUrl,
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

module.exports = router