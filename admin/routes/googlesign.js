const router = require('express').Router()
const session = require('express-session');
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

router.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());


/***for testing */


const User = require('../../models/user')
// const User = new mongoose.model("User", userSchema);
// passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    // User.findById(id, function (err, user) {
    //     done(err, user);
    // });
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null))
});

/*********** */

var userdata="";


passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/admin",
    },
    function (accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        userdata = profile;
        // User.findOrCreate({
        //     googleId: profile.id
        // }, function (err, user) {
        //     return cb(err, user);
        // });
        User.findById(id)
            .then(user => {
                return cb(null, user)
            })
            .catch(err => {
                const user = new User(profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value)
                User.create(user)
                    .then(result => {
                        return cb(null,user)
                    })
                    .catch(err => {
                        return cb(err, null)
                    })
            })
    }
));

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));


router.get('/auth/google/admin',
    passport.authenticate('google'), // complete the authenticate using the google strategy
    (err, req, res, next) => { // custom error handler to catch any errors, such as TokenError
        if (err.name === 'TokenError') {
            console.log(userdata);
            res.send(err)
             // redirect them back to the login page
        } else {
            console.log(err);
            
            // Handle other errors here
        }
    },
    (req, res) => { // On success, redirect back to '/'
        // res.redirect('/');
        res.send(userdata)
        console.log("Loged In");
        
    }
);

module.exports = router