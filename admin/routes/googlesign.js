const router = require('express').Router()
var google = require('googleapis').google;
const session = require('express-session');
const UserList = require('./UsersList')
const db = require('../../db');
const User = require('../../models/user');

var client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    `${process.env.DOMAIN}/googlesign/oauth2callback`
);

function getAuthenticationUrl() {
    // Use 'profile' scope to authorize fetching the user's profile
    return client.generateAuthUrl({
        scope: ['profile', 'email']
    });
}


function getUser(authorizationCode, callback) {
    // With the code returned from OAuth flow, get an access token
    client.getToken(authorizationCode, function(err, tokens) {
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
            function(err, profile) {
                if (err) return callback(err);
                //  console.log(profile)
                // var user = {
                //     id: profile.data.id,
                //     email: profile.data.email,
                //     name: profile.data.name,
                //     imageUrl: profile.data.picture
                // };

                // will be used for database based user role
                db.find({ email: profile.data.email }, User.tableName)
                    .then(results => {
                        const user = results[0];
                        user.imgUrl = '/profile/image?id=' + user.id
                        console.log(user)
                        callback(null, user)
                    })
                    .catch(err => {
                        console.log(err)
                        callback("Not Authorized", null)
                    })


                // callback(null, user);
            });
    });

}

router.get('/', function(req, res) {
    var authenticationUrl = getAuthenticationUrl();
    res.redirect(authenticationUrl);
    // res.send("KKJ")
});



/* Use OAuth 2.0 authorization code to fetch user's profile */
router.get('/oauth2callback', function(req, res, next) {
    const ADMIN = 1
    const HOD = 2
    const FACULTY = 3
    getUser(req.query.code, function(err, user) {
        if (err) return next(err);

        req.session.isAdmin = "false";
        if (user.role == ADMIN) {
            Navbar = [{
                link: '/notices',
                title: 'Notices',
                id: "notices"
            }, {
                link: '/events',
                title: 'Events',
                id: 'events'
            }, {
                link: '/profile',
                title: 'Profile',
                id: 'profile'
            }, {
                link: '/faculty-management',
                title: 'Faculty Management',
                id: 'fac-management'
            }]

            req.session.Navbar = Navbar;
            req.session.isAdmin = "true";
            // console.log(mainAdmin);
        } else if (user.role == HOD) {


            Navbar = [{
                link: '/notices',
                title: 'Notices',
                id: "notices"
            }, {
                link: '/events',
                title: 'Events',
                id: 'events'
            }, {
                link: '/profile',
                title: 'Profile',
                id: 'profile'
            }]
            req.session.Navbar = Navbar;


        } else if (user.role == FACULTY) {
            Navbar = [{
                link: '/profile',
                title: 'Profile',
                id: 'profile'
            }]
            req.session.Navbar = Navbar;
        } else {
            res.send("Sorry, You don't have access")
        }
        req.session.user = user;
        res.redirect('/');

    });
});

module.exports = router