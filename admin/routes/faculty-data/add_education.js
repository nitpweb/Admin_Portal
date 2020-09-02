const router = require('express').Router()
const db = require('../../../db')
const Education = require('../../../models/education')
const formidable = require('formidable')

router.post("/", (req, res) => {
    const user = req.session.user
    var form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            res.send("Parsing error")
        }
        if (fields.certi_name && fields.institute_name && fields.year) {
            db.query(`insert into ${Education.tableName} set ?`, {
                    user_id: user.id,
                    email: user.email,
                    certification: fields.certi_name,
                    institution: fields.institute_name,
                    passing_year: fields.year
                },
                (err, results, fields) => {
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