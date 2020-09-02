const router = require('express').Router()
const db = require('../../../db')
const Subjects = require('../../../models/subjects')
const formidable = require('formidable')

router.post("/", (req, res) => {
    const user = req.session.user
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            res.send("Parsing error")
        }
        console.log(fields.subject_name);
        if (fields.subject_name) {
            db.query(`insert into ${Subjects.tableName} set ?`, { userId: user.id, email: user.email, subject: fields.subject_name }, (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.send(err)
                }
            })
        }
    })
})

module.exports = router