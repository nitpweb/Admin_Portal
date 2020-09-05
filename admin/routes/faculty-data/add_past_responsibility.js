const router = require('express').Router()
const db = require('../../../db')
const pastResponsibility = require('../../../models/past-responsibility')
const formidable = require('formidable')

router.post("/", (req, res) => {
    const user = req.session.user
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            res.send("Parsing error")
        }
        if (fields.past_responsibility) {
            db.query(`insert into ${pastResponsibility.tableName} set ?`, { user_id: user.id, email: user.email, past_responsibility: fields.past_responsibility }, (err, results, fields) => {
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