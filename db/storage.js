const google = require('googleapis').google;
const fs = require('fs');
const request = require('request')
const TOKEN_PATH = 'token.json';
const FOLDER_PATH = 'folder_id.json';

var oAuth2Client = new google.auth.OAuth2(
    process.env.DRIVE_ID,
    process.env.DRIVE_SECRET,
    `${process.env.DOMAIN}/changeDrive/oauth2callback`
);

var isTokenSet = false
var isFolderIdSet = false

var folder_id = "";

if (fs.existsSync(TOKEN_PATH)) {
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            console.log(err);
            isTokenSet = false;
            return;
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        isTokenSet = true
    });
}

if (fs.existsSync(FOLDER_PATH)) {
    fs.readFile(FOLDER_PATH, (err, folderidval) => {
        if (err) {
            console.log(err);
            isFolderIdSet = false;
            return;
        }
        folder_id = JSON.parse(folderidval).folder_id;
        isFolderIdSet = true
    });
}

class FileSchema {
    constructor(id, webViewLink) {
        this.id = id
        this.webViewLink = webViewLink
    }
}

module.exports = {
    /**
     * Upload file to the G Drive and returns promise with link of the file
     * @param {string} FilePath absolute path to the file
     * @param {string} mimetype file extension for e.g. .txt, .pdf, .jpeg
     * @param {string} filename Name of the file
     * @param {number} filesize size of the file in bytes
     * @returns {Promise<FileSchema>} Url of the uploaded file
     */
    uploadFile: function(FilePath, mimetype, filename, filesize) {
        if (!isTokenSet) {
            oAuth2Client.setCredentials(JSON.parse(process.env.token));
        }

        if (!isFolderIdSet) {
            folder_id = process.env.FOLDER_ID;
        }

        // console.log('token', process.env.token)
        const drive = google.drive({
            version: 'v3',
            auth: oAuth2Client
        });

        var fileMetadata = {
            'name': (filename),
            parents: [folder_id]
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
                    onUploadProgress: function(e) {
                        console.log(Math.floor((e.bytesRead / filesize) * 100) + "%");
                    }
                },
                function(err, res) {
                    if (err) {
                        // Handle error
                        console.log(err);
                        isTokenSet = false
                        reject(err)
                    } else {
                        // console.log('File Id: ', res.data);
                        // let link = res.data.webViewLink;
                        // console.log(res.data)
                        resolve(res.data)
                        // console.log(link);
                    }
                });
        })

    },
    deleteFile: (fileId) => {
        if (!isTokenSet) {
            oAuth2Client.setCredentials(JSON.parse(process.env.token));
        }


        // console.log('token', process.env.token)
        const drive = google.drive({
            version: 'v3',
            auth: oAuth2Client
        });

        drive.files.delete({
                fileId: fileId,
                auth: oAuth2Client
            })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    },

    /**
     * @param {string} fileId fileid of target file to be updated
     * @param {string} filePath
     * @returns {Promise} 
     */
    updateFile: (fileId, filePath) => {
        if (!isTokenSet) {
            oAuth2Client.setCredentials(JSON.parse(process.env.token));
        }

        // console.log('token', process.env.token)
        const drive = google.drive({
            version: 'v3',
            auth: oAuth2Client
        });

        return drive.files.update({
                fileId: fileId,
                media: {
                    body: fs.readFileSync(filePath)
                }
            })
            .then(res => {
                return res.data
            })
    },
    getFile: fileId => {
        const url = `https://drive.google.com/uc?id=${fileId}&export=download`
        return new Promise((resolve, reject) => {
            request(url, function(err, response, body) {
                if(!err && response.statusCode == 200) {
                    resolve(body)
                }
                else {
                    reject(err)
                }
            })
        })
        
    }
}