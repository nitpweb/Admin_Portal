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
        res.render('notices', {
            profileimgsrc: 'images/profiledefault.jfif',
            title_top: 'Notices',
            user: {
                imgUrl: user.imageUrl,
                name: user.name,
                email: user.email
            },
            Navbar: req.session.Navbar,
            notices: ['notice']
        })
    } else {
        res.render('login')
    }
})

module.exports = router