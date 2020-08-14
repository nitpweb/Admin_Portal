const router = require('express').Router()
var google = require('googleapis').google;
const fs = require('fs');
const readline = require('readline');
const session = require('express-session');
const UsersList = require('./UsersList')

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const TOKEN_PATH = 'token.json';
var folderId = ""

var client = new google.auth.OAuth2(
    process.env.DRIVE_ID,
    process.env.DRIVE_SECRET,
    "http://localhost:3000/changeDrive/oauth2callback"
);

function getAuthenticationUrl() {
    // Use 'profile' scope to authorize fetching the user's profile
    return client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
}


function getUser(code) {
   client.getToken(code, (err, token) => {
       if (err) return console.log(err);
       var OAuth2 = google.auth.OAuth2;
       var oAuth2Client = new OAuth2();
       oAuth2Client.setCredentials(token);
       console.log(token);
    //    if(fs.existsSync(TOKEN_PATH)){
    //         fs.unlinkSync(TOKEN_PATH);
    //    }
       // Store the token to disk for later program executions
       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
           if (err) return console.log(err);
           console.log('Token stored to', TOKEN_PATH);
       });
   });
}



router.get('/', function (req, res) {
    // folderId = req.params.folderId;
    if(req.session.user!=undefined){
        if (req.session.user.email == UsersList.mainAdmin) {
            var authenticationUrl = getAuthenticationUrl();
            res.redirect(authenticationUrl);
        } else {
            res.send("Access Denied!!!!!!!!")
        }
    }
    else{
        res.redirect('/login')
    }
});



/* Use OAuth 2.0 authorization code to fetch user's profile */
router.get('/oauth2callback', function (req, res, next) {
    getUser(req.query.code, function (err){
        console.log(err);
    })
    res.redirect('/')
});

module.exports = router
