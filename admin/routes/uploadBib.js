const router = require('express').Router()
const formidable = require('formidable')
const fs = require('fs')
const storage = require('../../db/storage')
const session = require('express-session')
const bibParser = require("../middleware/bibParser")
const request = require('request')



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
    let user = req.session.user
    form.parse(req, async function(err, fields, files) {
        if (err) {
            console.log(err);
            res.send("Parsing error")
        }
        let file = files.bib_file
        const user = req.session.user

        // Check if bib file exist for current user in Publications table

        // if yes:
        // update the file on gdrive

        // else:
        // create file on gdrive and get fileId
        // insert or update the table for current user with filedId



        // const data = await storage.uploadFile(file.path, file.type, user.id + ".bib", file.size)
        // storage.updateFile('1g2xPY3X5swckZrRV1vIjkylKm9nKNPUI', file.path)
        // let url = `https://drive.google.com/uc?id=${data.id}&export=download`
        // console.log(url)
        // request.get(url, (err, response, body) => {
        //     if(!err && response.statusCode == 200) {
        //         var bib = bibParser.toJSON(body)
        //         removeSpecial(bib)
        //         res.json(bib)
        //     }
        // })
        // file.path = url
        // console.log(file)
        // fs.readFile(file.path, { encoding: "utf8" }, (err, data) => {
        //     if (!err) {
        //         var bib = bibParser.toJSON(data)
        //         removeSpecial(bib)
        //         res.json(bib)
        //     } else {
        //         console.log(err);
        //     }
        // })
        // res.redirect("/profile")
    })
})
module.exports = router