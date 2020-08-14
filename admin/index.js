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
    res.redirect('/notices')
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

const important_toggle = require("./routes/important_toggle")
router.use('/important_toggle', important_toggle)

const visible_toggle = require("./routes/visible_toggle")
router.use('/visible_toggle', visible_toggle)

module.exports = router