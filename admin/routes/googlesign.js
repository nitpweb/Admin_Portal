const router = require('express').Router()
var google = require('googleapis').google;
const session = require('express-session');
const UserList = require('./UsersList')

var client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:3000/googlesign/oauth2callback"
);

 function getAuthenticationUrl() {
     // Use 'profile' scope to authorize fetching the user's profile
     return client.generateAuthUrl({
         scope: ['profile', 'email']
     });
 }


 function getUser(authorizationCode, callback) {
     // With the code returned from OAuth flow, get an access token
     client.getToken(authorizationCode, function (err, tokens) {
         if (err) return callback(err);
        //  console.log(tokens);
         
         var OAuth2 = google.auth.OAuth2;
         var oauth2Client = new OAuth2();
         oauth2Client.setCredentials({
             access_token: tokens.access_token
         });
         var oauth2 = google.oauth2({
             auth: oauth2Client,
             version: 'v2'
         });
         oauth2.userinfo.get(
             function (err, profile) {
                 if (err) return callback(err);
                 console.log(profile)
                 var user = {
                     id: profile.data.id,
                     email: profile.data.email,
                     name: profile.data.name,
                     imageUrl: profile.data.picture
                 };
                 callback(null, user);
             });
     });
     
 }



router.get('/', function (req, res) {
    var authenticationUrl = getAuthenticationUrl();
    res.redirect(authenticationUrl);
    // res.send("KKJ")
});



/* Use OAuth 2.0 authorization code to fetch user's profile */
router.get('/oauth2callback', function (req, res, next) {
    getUser(req.query.code, function (err, user) {
        if (err) return next(err);
        const onlyprofile = UserList.onlyprofile
        const allservice = UserList.allservice
        const mainAdmin = UserList.mainAdmin
        // console.log(onlyprofile);
        // console.log(allservice);
        // console.log(mainAdmin);
        var showall = false,
            showprof = false;
        if(mainAdmin==user.email){
            Navbar = [{
                link: '/notices',
                title: 'notices'
            }, {
                link: '/events',
                title: 'events',
                id: 'events'
            }, {
                link: '/profile',
                title: 'faculty profile',
                id: 'profile'
            }]
            req.session.Navbar = Navbar;
            req.session.isAdmin = "true";
        }
        else{
            for(var i=0;i<onlyprofile.length;i++){
                if(user.email==onlyprofile[i]){
                    showprof=true;
                    break;
                }
            }
            for(var i=0;i<allservice.length;i++){
                if(user.email==allservice[i]){
                    showall=true;
                    break;
                }
            }
            if(showall&&showprof)
            {
                Navbar = [{
                    link: '/notices',
                    title: 'notices'
                } ,{
                    link: '/events',
                    title: 'events'
                }, {
                    link: '/profile',
                    title: 'faculty profile'
                }]
                req.session.Navbar = Navbar;
            }
            if (!showall && showprof) {
                Navbar = [{
                    link: '/profile',
                    title: 'faculty profile'
                }]
                req.session.Navbar = Navbar;
            }
            req.session.isAdmin = "false";
        }
        // console.log("showall",showall);
        // console.log("showprof",showprof);
        if(!showall&&!showprof&&user.email!=mainAdmin){
            res.send("Sorry, You don't have access")
        }else{
            req.session.user = user;
            res.redirect('/');
        }
    });
});

module.exports = router