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

const addSubject = require("./routes/faculty-data/add_subjects")
router.use('/add-subject', addSubject)

const addphdcandidates = require("./routes/faculty-data/add_phdcandidates")
router.use('/add-phdcandidates', addphdcandidates)

const addnewproject = require("./routes/faculty-data/add_newproject")
router.use('/add-newproject', addnewproject)

const addnewprofessionalservice = require("./routes/faculty-data/add_professionalservice")
router.use('/add-professional-service',addnewprofessionalservice)

const addworkexperience = require("./routes/faculty-data/add_workexperience")
router.use('/add-work-experience' , addworkexperience)


const memberships = require("./routes/faculty-data/add_memberships")
router.use('/memberships', memberships)

const education = require("./routes/faculty-data/add_education")
router.use('/education', education)

const currResponsibility = require("./routes/faculty-data/add_curr_responsibility")
router.use('/currResponsibility', currResponsibility)

const pastResponsibility = require("./routes/faculty-data/add_past_responsibility")
router.use('/pastResponsibility', pastResponsibility)


module.exports = router