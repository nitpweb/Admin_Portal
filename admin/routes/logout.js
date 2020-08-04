const router = require('express').Router()


router.get('/',(req,res) => {
    req.session.destroy()
    req.session=null;
    res.redirect("/login")
})

module.exports = router