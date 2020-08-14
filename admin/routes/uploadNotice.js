const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const google = require('googleapis').google;
const db = require('../../models/notice') 
const session = require('express-session');

const TOKEN_PATH = 'token.json';

var oAuth2Client = new google.auth.OAuth2(
    process.env.DRIVE_ID,
    process.env.DRIVE_SECRET,
    "http://localhost:3000/changeDrive/oauth2callback"
);

fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
        console.log(err);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
});

function uploadFile(auth, FilePath, mimetype, filename, filesize, index, callback) {
    const drive = google.drive({
        version: 'v3',
        auth
    });
    var fileMetadata = {
        'name': (new Date().getTime()+filename)
    };
    var media = {
        mimeType: mimetype,
        body: fs.createReadStream(FilePath)
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id ,webViewLink'
    }, {
        onUploadProgress: function (e) {
            console.log(Math.floor((e.bytesRead/filesize)*100)+"%");
        }
    },
     function (err, res) {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            // console.log('File Id: ', res.data);
            // drive.permissions.create({
            //     fileId: res.data.id,
            //     body:{
            //         displayName: 'anyone',
            //         allowFileDiscovery: 'true'
            //     }
            // });
            var link=res.data.webViewLink;
            callback(index, link)
            // console.log(link);
        }
    });
}

router.post('/',(req, res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var title = fields.main_title;
        var open_date = fields.open_date;
        var close_date = fields.close_date;
        var ittr = fields.ittrname;
        var important = fields.important;
        console.log(open_date);
        if(important==undefined)
            important = 0;
        else
            important = 1;
        var attach = new db.Attachment([],[])
        var time_as_id = new Date().getTime();
        var notice_obj = new db.Notice(time_as_id, title, attach, 5, new Date(open_date).getTime(), new Date(close_date).getTime(), important)
        db.Notice.create(notice_obj);
        console.log(important);
        console.log(ittr);
        for (var i = 1; i <= ittr; i++) {
            var oldPath = files["filename" + i].path;
            var type = files["filename" + i].type;
            uploadFile(oAuth2Client, oldPath, type, files["filename" + i].name, files["filename" + i].size,i,function(index, link){
                console.log(link);
                db.Notice.updateAttachments(time_as_id, fields["subtitle" + index], link);
                // if(index == ittr)
                //     res.redirect('/newNotices')
            });
        }
        res.redirect('/newNotices')
    });
})

module.exports = router