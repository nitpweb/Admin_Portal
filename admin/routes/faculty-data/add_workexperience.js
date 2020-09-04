const router = require('express').Router();
const db = require('../../../db');
const workexperience = require('../../../models/workexperience');
const formidable = require('formidable');

router.post('/',(req,res) => {
    const user = req.session.user;
    var form = new formidable.IncomingForm();
    form.parse(req,(err, fields, files)=>{
        if(err) {
            res.send("Parsing Error");
        }
        console.log(fields.workexperience);
        if(fields.workexperience){
            db.query(`insert into ${workexperience.tableName} set ?`, { userId: user.id, email: user.email,work_experiences:fields.workexperience }, (err, results, fields) => {
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



