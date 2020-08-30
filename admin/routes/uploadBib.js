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
/*remove special character from bib data*/
function removeSpecial(params) {
    params.forEach(entry => {
        var newTags = entry.entryTags
        for (let key in newTags) {
            newTags[key] = newTags[key].replace(/{/g, "").replace(/}/g, "").replace(/\\/g, "").replace(/[\u{0080}-\u{FFFF}]/gu, "\"")
        }
    })
}
/* sort entries by year*/
function sortByYear(params) {
    params.sort(function(a, b) {
        return b.entryTags.YEAR - a.entryTags.YEAR
    })
}
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
                let url = `https://drive.google.com/uc?id=${fileId}&export=download`
                request.get(url, (err, response, body) => {
                    if (!err && response.statusCode == 200) {
                        var bib = bibParser.toJSON(body)
                        removeSpecial(bib)
                        res.json(bib)
                    }
                })
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
                request.get(url, (err, response, body) => {
                    if (!err && response.statusCode == 200) {
                        var bib = bibParser.toJSON(body)
                        removeSpecial(bib)
                        res.json(bib)
                    }
                })
            }
        })

        // file.path = url
        // console.log(file)
        // fs.readFile(file.path, { encoding: "utf8" }, (err, data) => {
        //     if (!err) {
        //         var bib = bibParser.toJSON(data)
        //         removeSpecial(bib)
        //         var books = [],
        //             journals = [],
        //             conferences = []
        //         bib.forEach(entry => {
        //             if (entry.entryType === "INPROCEEDINGS") conferences.push(entry)
        //             else if (entry.entryType === "ARTICLE") journals.push(entry)
        //             else if (entry.entryType === "BOOKS") books.push(entry)
        //         })
        //         sortByYear(books)
        //         sortByYear(journals)
        //         sortByYear(conferences)
        //         res.json(journals)
        //     } else {
        //         console.log(err);
        //     }
        // })
        // res.redirect("/profile")
    })
})
module.exports = router