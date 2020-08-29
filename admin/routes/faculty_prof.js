const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const db = require('../../db');
const User = require('../../models/user');


router.get('/', (req, res) => {
    var user = req.session.user;
    if (user != undefined) {
        res.render('facultyprof', {
            profileimgsrc: 'images/profiledefault.jfif',
            title_top: 'faculty Profile',
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

router.post('/', (req, res) => {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if(err) {

            res.json(err)
        }
        db.query(`insert into users set ?`, {name: fields.name, image: fs.readFileSync(files.image.path)}, (err, results, fields) => {
            if(err) {
                console.log(err)
                res.json(err)
            }
            res.json({fields,results})
        })
        
    })
})

router.get('/image', (req, res) => {
    const id = req.query.id
    // console.log(id)
    db.query(
        `select image from ${User.tableName} where id='${id}';`,
        (err, results, fields) => {
            if(err) res.status(500).json(err)
            // console.log(results[0].image)
            const image = results[0].image
            res.send(image);
        }
    )
})

module.exports = router