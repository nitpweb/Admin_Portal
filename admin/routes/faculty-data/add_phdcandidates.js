const router = require('express').Router();
const db = require('../../../db');
const phdCandidates = require('../../../models/phdcandidates');
const formidable = require('formidable');

router.post('/',(req,res) => {
    const user = req.session.user;
    var form = new formidable.IncomingForm();
    form.parse(req,(err, fields, files)=>{
        if(err) {
            res.send("Parsing Error");
        }
        console.log(fields.student_name);
        if(fields.student_name && fields.thesis_name && fields.start_year && fields.completion_year){
            db.query(`insert into ${phdCandidates.tableName} set ?`, { userId: user.id, emailId: user.email,phd_student_name:fields.student_name, thesis_topic:fields.thesis_name,start_year:fields.start_year,completion_year:fields.completion_year }, (err, results, fields) => {
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