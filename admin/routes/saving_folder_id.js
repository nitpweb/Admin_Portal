const router = require('express').Router()

router.get('/:id', (req, res) => {
    //var form = new formidable.IncomingForm();
    // form.parse(req, async function (err, fields, files) {
    //     if (err) {
    //         res.send("Parsing Error")
    //     }
        process.env.FOLDER_ID = req.params.id;
    //})
    res.redirect('/changeDrive')
})

module.exports = router