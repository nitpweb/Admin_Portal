const router = require('express').Router()
var formidable = require('formidable');

const session = require('express-session');

router.use(session({
    secret: "ablackcat",
    resave: false,
    saveUninitialized: true,
}));

router.get('/', (req, res) => {
    // var user = req.session.user;
    // if (user != undefined) {
        res.render('newNotices')
    // } else {
    //     res.redirect("/login")
    // }
})

module.exports = router