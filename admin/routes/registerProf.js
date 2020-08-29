const router = require('express').Router()
var formidable = require('formidable');
const db = require("../../db");

router.post('/', (req, res) => {
     var form = new formidable.IncomingForm();
     form.parse(req, async function (err, fields, files) {
        if (err) {
            res.send("Parsing Error")
        }
        
    })
});