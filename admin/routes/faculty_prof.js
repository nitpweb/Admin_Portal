const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const db = require('../../db');
const User = require('../../models/user');
const Image = require('../../models/image');
const { update } = require('../../db');
// const bodyParser = require('body-parser')
// router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    var user = req.session.user;
    if (user != undefined) {
        res.render('facultyprof', {
            title_top: 'faculty Profile',
            user: {
                imgUrl: user.imgUrl,
                name: user.name,
                email: user.email,
                department: user.department,
                designation: user.designation,
                ext_no: user.ext_no,
                research_interest: user.research_interest
            },
            Navbar: req.session.Navbar,
            Drive: req.session.isAdmin
        })
    } else {
        res.redirect("/login")
    }
})

router.post('/', (req, res) => {
    const id = req.session.user.id
    // console.log(id);
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.json(err)
        }
        db.query(`update ${User.tableName} set research_interest='${fields.research_interests}' where id=${id};`, (err, results, fields) => {
            if (err) {
                console.log(err)
                res.json(err)
            }
            res.json({ fields, results })
        })

        db.query(`select user_id from ${Image.tableName} where user_id='${id}';`),(err,fields,results)=>{
            if(results && results.length==1){
                db.query(`update ${Image.tableName} set image=${fields.profile_img} ?`, (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        res.json(err)
                    }
                    res.json({ fields, results })
                })
            }else{
                db.query(`insert into ${Image.tableName} set ?`, { user_id: req.session.user.id, email: req.session.user.email, image: files.profile_img }, (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        res.json(err)
                    }
                    res.json({ fields, results })
                })
            }
        }
    })
})

router.get('/image', (req, res) => {
    const id = req.query.id
    // console.log(id)
    db.query(
        `select image from ${Image.tableName} where user_id='${id}';`,
        (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(500).json(err)
            }
            // console.log(results[0].image)
            if (results && results.length == 1) {
                const image = results[0].image
                console.log(results)
                res.send(image);
            } else {
                // console.log(process.env.PWD)
                res.send(fs.readFileSync(process.env.PWD + '/public/images/img_avatar.png'))
            }

        }
    )
})

module.exports = router