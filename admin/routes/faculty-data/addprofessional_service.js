const router = require('express').Router();
const db = require('../../../db');
const professionalservice = require('../../../models/professional_service');
const formidable = require('formidable');

router.post('/',(req,res) => {
    const user = req.session.user;
    var form = new formidable.IncomingForm();
    form.parse(req,(err, fields, files)=>{
        if(err) {
            res.send("Parsing Error");
        }
        console.log(fields.prof_service);
        if(fields.prof_service){
            db.query(`insert into ${professionalservice.tableName} set ?`, { userId: user.id, emailId: user.email,services:fields.prof_service }, (err, results, fields) => {
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



