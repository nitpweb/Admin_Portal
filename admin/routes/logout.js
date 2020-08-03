const router = require('express').Router()
const session = require('express-session');

router.use(session({
    secret: "ablackcat",
    resave: false,
    saveUninitialized: true,
}));

router.get('/',(req,res) => {
    req.session=null;
    res.redirect('/googlesign')
})

module.exports = router