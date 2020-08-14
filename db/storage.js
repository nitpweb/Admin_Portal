const google = require('googleapis').google;
const fs = require('fs')

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


module.exports = {
    /**
     * Upload file to the G Drive and returns promise with link of the file
     * @param {string} FilePath absolute path to the file
     * @param {string} mimetype file extension for e.g. .txt, .pdf, .jpeg
     * @param {string} filename Name of the file
     * @param {number} filesize size of the file in bytes
     * @returns {Promise<string>} Url of the uploaded file
     */
    uploadFile: function (FilePath, mimetype, filename, filesize) {
        const drive = google.drive({
            version: 'v3',
            auth: oAuth2Client
        });

        var fileMetadata = {
            'name': (new Date().getTime()+filename)
        };

        var media = {
            mimeType: mimetype,
            body: fs.createReadStream(FilePath)
        };

        return new Promise((resolve, reject) => {
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
                    reject(err)
                } else {
                    // console.log('File Id: ', res.data);
                    // drive.permissions.create({
                    //     fileId: res.data.id,
                    //     body:{
                    //         displayName: 'anyone',
                    //         allowFileDiscovery: 'true'
                    //     }
                    // });
                    let link = res.data.webViewLink;
                    resolve(link)
                    // console.log(link);
                }
            });
        })
        
    }
}