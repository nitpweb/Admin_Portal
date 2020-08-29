const User = require('../../../models/user');

const router = require('express').Router()

router.get('/', (req, res) => {
    var user = req.session.user;
     if (user != undefined) {
         res.render('fac-management', {
             profileimgsrc: 'images/profiledefault.jfif',
             title_top: 'Faculty Management',
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

function check(...args) {
    for(let i =0; i<args.length; i++) {
        if(args[i] == undefined || args[i]==null || args[i] == '') {
            return false;
        }
    }
    return true;
}
router.post('/', (req, res) => {
    
    const {name, email, designation, department, ext_no, role} = req.body
    
    if(check(name, email, designation, department, role) && role != 1) {
        // create user
        User.create({
            name,
            email,
            designation,
            department,
            ext_no,
            role
        })
        .then(value => {
            res.redirect('/faculty-management')
        })
        .catch(err => {
            res.json(err)
        })
    }
    else {
        res.send("all field are neccessary")
    }
})

module.exports = router