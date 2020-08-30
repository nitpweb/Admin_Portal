const User = require('../../../models/user');
const db = require('../../../db')
const router = require('express').Router()

router.use(function(req, res, next) {
    // only access to admin
    const user = req.session.user
    if (user == undefined || user == null) {
        res.redirect('/login')
    } else if (user && user.role == User.ADMIN) {
        next()
    } else {
        res.send("Unauthorized access")
    }
})

router.get('/', (req, res) => {
    var user = req.session.user;

    User.getAllUsers()
        .then(faculties => {
            res.render('fac-management', {
                profileimgsrc: 'images/profiledefault.jfif',
                title_top: 'Faculty Management',
                user: {
                    imgUrl: user.imgUrl,
                    name: user.name,
                    email: user.email
                },
                Navbar: req.session.Navbar,
                Drive: req.session.isAdmin,
                faculties
            })
        })
        .catch(err => {
            res.json(err)
        })



})

function check(...args) {
    for (let i = 0; i < args.length; i++) {
        if (args[i] == undefined || args[i] == null || args[i] == '') {
            return false;
        }
    }
    return true;
}
router.post('/', (req, res) => {

    const { name, email, designation, department, ext_no, role } = req.body

    if (check(name, email, designation, department, role) && role != 1) {
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
    } else {
        res.send("all field are neccessary")
    }
})

router.patch('/', (req, res) => {

})

module.exports = router