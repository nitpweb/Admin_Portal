const router = require('express').Router()
const db = require('../../../db')
const Memberships = require('../../../models/memberships')
const formidable = require('formidable')

router.post("/", (req, res) => {
    const user = req.session.user
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            res.send("Parsing error")
        }
        if (fields.membership_id && fields.society_name) {
            db.query(`insert into ${Memberships.tableName} set ?`, { user_id: user.id, email: user.email, membership_society: fields.society_name, membership_id: fields.membership_id }, (err, results, fields) => {
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