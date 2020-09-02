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

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    req.session = null;
    res.redirect("/login")
})

const changeDrive = require("./routes/changeDrive")
router.use('/changeDrive', changeDrive)

const newNotices = require("./routes/newNotices")
router.use('/newNotices', newNotices)

const uploadNotices = require("./routes/uploadNotice")
router.use('/uploadNotices', uploadNotices)

const saving_folder_id = require("./routes/saving_folder_id")
router.use('/saving_folder_id', saving_folder_id)

const uploadEvents = require("./routes/events/uploadEvents")
router.use('/uploadEvents', uploadEvents)

const uploadBib = require("./routes/uploadBib")
router.use('/uploadBib', uploadBib)

const facManagementRouter = require('./routes/faculty-management')
router.use('/faculty-management', facManagementRouter)

const addSubject = require("./routes/faculty-data/addsubject")
router.use('/addsubject', addSubject)

const addphdcandidates = require("./routes/faculty-data/addphd_candidates")
router.use('/addphdcandidates', addphdcandidates)

const addnewproject = require("./routes/faculty-data/addnew_project")
router.use('/addnewproject', addnewproject)


module.exports = router