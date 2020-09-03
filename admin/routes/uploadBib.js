const router = require('express').Router()
const formidable = require('formidable')
const fs = require('fs')
const storage = require('../../db/storage')
const session = require('express-session')
const bibParser = require("../middleware/bibParser")
const request = require('request')
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
        let file = files.bib_file
        const user = req.session.user

        db.query(`select publication_id from ${Publications.tableName} where user_id=${user.id}`, async function(err, results, fields) {
            if (results && results.length == 1) {
                const fileId = results[0].publication_id;
                storage.updateFile(fileId, file.path)
            } else {
                const data = await storage.uploadFile(file.path, file.type, user.id + ".bib", file.size)
                // console.log(data);

                db.query(`insert into ${Publications.tableName} set ?`, { user_id: user.id, email: user.email, publication_id: data.id }, (err, results, fields => {
                    if (err) {
                        console.log(err);
                        res.json(err)
                    }
                    res.json({ fields, results })
                }))
            }
            res.redirect('/profile')
        })
    })
})
module.exports = router