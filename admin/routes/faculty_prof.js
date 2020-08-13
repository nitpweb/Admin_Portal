const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');


router.get('/', (req, res) => {
    var user = req.session.user;
    if (user != undefined) {
        res.render('facultyprof', {
            profileimgsrc: 'images/profiledefault.jfif',
            title_top: 'faculty Profile',
            user: {
                imgUrl: user.imageUrl,
                name: user.name,
                email: user.email
            },
            Navbar: req.session.Navbar,
            Drive: req.session.isAdmin
        })
    } else {
        res.redirect("/login")
    }
})

module.exports = router