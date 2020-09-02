const router = require('express').Router();
const db = require('../../../db');
const newproject = require('../../../models/newproject');
const formidable = require('formidable');

router.post('/',(req,res) => {
    const user = req.session.user;
    var form = new formidable.IncomingForm();
    form.parse(req,(err, fields, files)=>{
        if(err) {
            res.send("Parsing Error");
        }
        console.log(fields.project);
        if(fields.project){
            db.query(`insert into ${newproject.tableName} set ?`, { userId: user.id, emailId: user.email,project:fields.project }, (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.send(err)
                }
            });
        }
    });
    res.redirect('/profile');
});

module.exports = router;