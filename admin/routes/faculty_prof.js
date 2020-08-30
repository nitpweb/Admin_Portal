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
    const user = req.session.user
    // console.log(id);
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            res.json(err)
        }
        console.log(Image.tableName)
        

        db.query(`update ${User.tableName} set research_interest='${fields.research_interests}' where id=${id};`, (err, results, fields) => {
            if (err) {
                console.log(err)
                // res.json(err)
            }
        })
        
        if(files.profile_img.path) {
            const image = fs.readFileSync(files.profile_img.path)

            db.find({user_id: user.id}, Image.tableName)
            .then(results => {
                // console.log(results)
                let query, data ={
                    image: image
                };
                if(results) {
                    query = `update ${Image.tableName} set ? where user_id=${user.id}`
                }
                else {
                    query = `insert into ${Image.tableName} set ?`
                    data.user_id = user.id
                    data.email = user.email
                }
                db.query(query, data, (err, results, fields) => {
                    if(err) {
                        console.log('err', err)
                        return
                    }
                    res.redirect('/profile')
                })
            })
            .catch(err => {
                console.log(err)
            })
        }

    })
})
router.get('/image', (req, res) => {
    const id = req.query.id
    console.log(id)
    db.query(
        `select image from ${Image.tableName} where user_id='${id}';`,
        (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(500).json(err)
            }
            if (results && results.length == 1 && results[0].image != null) {
                const image = results[0].image
                // console.log(results)
                res.send(image);
            } else {
                // console.log(process.env.PWD)
                res.send(fs.readFileSync(process.env.PWD + '/public/images/img_avatar.png'))
            }

        }
    )
})

module.exports = router