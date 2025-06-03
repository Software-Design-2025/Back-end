const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const Users = require('../models/users.m');

passport.use(
    new LocalStrategy(
        async function verify(username, password, cb) {
            const user = await Users.findOne({ username });
            if (!user) {
                return cb(null, false, { message: 'Username does not exist' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return cb(null, false, { message: 'Invalid password' });
            }

            cb(null, user, { message: 'Logged in successfully' });
        }
    )
);

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, 
    async function verify(accessToken, refreshToken, profile, cb) {
        let user = await Users.findOne({ profile_id: profile.id, provider: 'google' });
        if (!user) {
            user = new Users({
                fullname: profile.displayName,
                email: profile.emails[0].value,
                profile_id: profile.id,
                avatar: profile.photos[0].value,
                provider: 'google'
            });

            user = await user.save();
        }
        cb(null, user, { message: 'Logged in successfully' });
    })
);

passport.use(
    new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'photos']
    },
    async function verify(accessToken, refreshToken, profile, cb) {
        let user = await Users.findOne({ profile_id: profile.id, provider: 'facebook' });
        if (!user) {
            user = new Users ({
                fullname: profile.displayName,
                profile_id: profile.id,
                avatar: profile.photos[0].value,
                provider: 'facebook'
            });

            user = await user.save();
        }
        cb(null, user, { message: 'Logged in successfully' });
    }
));