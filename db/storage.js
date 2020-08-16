const google = require('googleapis').google;
const fs = require('fs')

const TOKEN_PATH = 'token.json';

var oAuth2Client = new google.auth.OAuth2(
    process.env.DRIVE_ID,
    process.env.DRIVE_SECRET,
    `${process.env.DOMAIN}/changeDrive/oauth2callback`
);

let isTokenSet = false

// if (fs.existsSync(TOKEN_PATH)){
//     fs.readFile(TOKEN_PATH, (err, token) => {
//         if (err) {
//             console.log(err);
//             isTokenSet = false;
//             return;
//         }
//         oAuth2Client.setCredentials(JSON.parse(token));
//         isTokenSet = true
//     });
// }

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
        if(!isTokenSet) {
            oAuth2Client.setCredentials(JSON.parse(process.env.token));
        }
        
        // console.log('token', process.env.token)
        const drive = google.drive({
            version: 'v3',
            auth: oAuth2Client
        });

        var fileMetadata = {
            'name': (new Date().getTime()+filename),
            parents: [process.env.FOLDER_ID]
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
                    isTokenSet = false
                    reject(err)
                } else {
                    // console.log('File Id: ', res.data);
                    let link = res.data.webViewLink;
                    resolve(link)
                    // console.log(link);
                }
            });
        })
        
    }
}