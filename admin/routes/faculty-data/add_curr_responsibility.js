const router = require('express').Router()
const db = require('../../../db')
const currResponsibility = require('../../../models/current-responsibility')
const formidable = require('formidable')

router.post("/", (req, res) => {
    const user = req.session.user
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            res.send("Parsing error")
        }
        if (fields.curr_responsibility) {
            db.query(`insert into ${currResponsibility.tableName} set ?`, { user_id: user.id, email: user.email, curr_responsibility: fields.curr_responsibility }, (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.send(err)
                }
                res.redirect('/profile')
            })
        }
    })
})

module.exports = router