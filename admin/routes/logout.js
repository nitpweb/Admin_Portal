const router = require('express').Router()
const session = require('express-session');

router.use(session({
    secret: "ablackcat",
    resave: false,
    saveUninitialized: true,
}));

router.get('/',(req,res) => {
    req.session.destroy()
    req.session=null;
    res.redirect("/login")
})

module.exports = router