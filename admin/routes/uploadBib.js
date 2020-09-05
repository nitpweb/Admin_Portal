const router = require('express').Router()
const formidable = require('formidable')
const fs = require('fs')
const storage = require('../../db/storage')
const session = require('express-session')
const Publications = require('../../models/publications')
const db = require('../../db')
const User = require('../../models/user')

router.post("/", (req, res) => {
    var form = new formidable.IncomingForm()
    let user = req.session.user
    form.parse(req, async function(err, fields, files) {
        if (err) {
            console.log(err);
            res.send("Parsing error")
        }
        let file = files.bib_file.path
        const user = req.session.user
        const data = fs.readFileSync(file, { encoding: "utf8" })
        db.find({ user_id: user.id }, Publications.tableName)
            .then(results => {
                if (results && results.length == 1) {
                    const fileId = results[0].publication_id
                    db.query(`update ${Publications.tableName} set publications="${data}" where publication_id=${fileId}`, (err, results, fields) => {
                        if (err) {
                            console.log(err);
                            res.send(err)
                        }
                    })
                } else {
                    db.query(`insert into ${Publications.tableName} set ?`, {
                        user_id: user.id,
                        email: user.email,
                        publications: data
                    }, (err, results, fields) => {
                        if (err) {
                            console.log(err);
                            res.send(err)
                        }
                    })
                }
                res.redirect("/profile")
            })
            .catch(err => {
                res.json(err)
            })
    })
})
module.exports = router