const router = require('express').Router()
var formidable = require('formidable');
var fs = require('fs');
const google = require('googleapis').google;

const TOKEN_PATH = 'token.json';

var oAuth2Client = new google.auth.OAuth2(
    process.env.DRIVE_ID,
    process.env.DRIVE_SECRET,
    "http://localhost:3000/changeDrive/oauth2callback"
);

fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
        console.log(err);
        return;
    }
    oAuth2Client.setCredentials(JSON.parse(token));
});

function uploadFile(auth, FilePath) {
    const drive = google.drive({
        version: 'v3',
        auth
    });
    var fileMetadata = {
        'name': ("file"+new Date().getTime())
    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(FilePath)
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id ,webViewLink'
    }, function (err, res) {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            console.log('File Id: ', res.data);
            var link=res.data.webViewLink;
            console.log(link);
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
        console.log(important);
        var subtitles = []
        var weblinks = []
        for (var i = 1; i <= ittr; i++) {
            subtitles.push(fields["subtitle" + i]);
            var oldPath = files["filename" + i].path;
            uploadFile(oAuth2Client,oldPath)
        }
        res.redirect('/newNotices')
    });
})

module.exports = router