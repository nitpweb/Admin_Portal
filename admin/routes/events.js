const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');


router.get('/', (req, res) => {
     var user = req.session.user;
     if (user != undefined) {
         res.render('events', {
             profileimgsrc: 'images/profiledefault.jfif',
             title_top: 'Events',
             user: {
                 imgUrl: user.imageUrl,
                 name: user.name,
                 email: user.email
             },
             Navbar: req.session.Navbar
         })
     } else {
        res.redirect("/login")
     }
})

module.exports = router