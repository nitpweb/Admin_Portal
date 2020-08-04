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
    if(user!=undefined){
        res.render('index', {
            profileimgsrc: 'images/profiledefault.jfif',
            title_top: 'Home',
            user: {
                imgUrl: user.imageUrl,
                name: user.name,
                email: user.email
            },
            Navbar: req.session.Navbar
        })
    }else{
        res.render('login')
    }
})

// Handling events route
const eventRouter = require('./routes/events')
router.use('/events', eventRouter)


const noticeRouter = require('./routes/notices')
router.use('/notices', noticeRouter)


const profileRouter = require('./routes/faculty_prof')
router.use('/profile', profileRouter)

const login = require("./routes/googlesign")
router.use('/googlesign', login)

const logout = require("./routes/logout")
router.use('/logout',logout)

module.exports = router