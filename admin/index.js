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
        res.render('index', {
            profileimgsrc: 'images/profiledefault.jfif',
            title_top: 'Home',
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

// Handling events route
const eventRouter = require('./routes/events')
router.use('/events', eventRouter)


const noticeRouter = require('./routes/notices')
router.use('/notices', noticeRouter)


const profileRouter = require('./routes/faculty_prof')
router.use('/profile', profileRouter)

const googlelogin = require("./routes/googlesign")
router.use('/googlesign', googlelogin)

const logout = require("./routes/logout")
router.use('/logout', logout)

const login = require("./routes/login")
router.use('/login', login)

const changeDrive = require("./routes/changeDrive")
router.use('/changeDrive', changeDrive)

const newNotices = require("./routes/newNotices")
router.use('/newNotices', newNotices)

const uploadNotices = require("./routes/uploadNotice")
router.use('/uploadNotices', uploadNotices)

module.exports = router