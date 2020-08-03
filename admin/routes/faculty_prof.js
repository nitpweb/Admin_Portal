const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const session = require('express-session');

router.use(session({
    secret: "ablackcat",
    resave: false,
    saveUninitialized: true,
}));

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
            Navbar: req.session.Navbar
        })
    } else {
        res.redirect("/googlesign")
    }
})

module.exports = router