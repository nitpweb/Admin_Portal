const router = require('express').Router()
const formidable = require('formidable')
const fs = require('fs')
const storage = require('../../db/storage')
const session = require('express-session')
const bibParser = require("../middleware/bibParser")
const { dataflow_v1b3 } = require('googleapis')


function removeSpecial(params) {
    params.forEach(entry => {
        var newTags = entry.entryTags
        for (let key in newTags) {
            newTags[key] = newTags[key].replace(/{/g, "").replace(/}/g, "").replace(/\\/g, "").replace(/[\u{0080}-\u{FFFF}]/gu, "\"")
        }
    })
}
router.post("/", (req, res) => {
    var form = new formidable.IncomingForm()
    form.parse(req, async function(err, fields, files) {
        if (err) {
            console.log(err);
            res.send("Parsing error")
        }
        let file = files.bib_file
        // let url = await storage.uploadFile(file.path, file.type, file.name, file.size)
        // file.path = url
        // console.log(file)
        fs.readFile(file.path, { encoding: "utf8" }, (err, data) => {
            if (!err) {
                var bib = bibParser.toJSON(data)
                removeSpecial(bib)
                res.json(bib)
            } else {
                console.log(err);
            }
        })
        // res.redirect("/profile")
    })
})
module.exports = router