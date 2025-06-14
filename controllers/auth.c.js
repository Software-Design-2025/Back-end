const Users = require('../models/users.m');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const passport = require('passport');

const callback = (req, res) => (err, user, info) => {
    if (err || !user) {
        return res.redirect(process.env.CLIENT_FAILURE_REDIRECT);
    }

    const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    );

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 30 * 60 * 1000
    });

    res.redirect(process.env.CLIENT_SUCCESS_REDIRECT);
}

module.exports = {
    register: async (req, res) => {
        try {
            const { fullname, username, email, password } = req.body;

            const existingUsername = await Users.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const existingEmail = await Users.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new Users({
                fullname, 
                username,
                email,
                password: hashedPassword
            });

            const savedUser = await newUser.save();

            return res.status(201).json({
                _id: savedUser._id,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    localLogin: async (req, res, next) => {
        passport.authenticate('local', { session: false}, (err, user, info) =>{
            if (!user) {
                return res.status(401).json({ message: info.message });
            }

            if (err) {
                return res.status(500).json({ message: err.message });
            }

            const accessToken = jwt.sign(
                { id: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );

            const refreshToken = jwt.sign(
                { id: user._id},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '30d' }
            );

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 30 * 60 * 1000
            });

            return res.status(200).json({ message: info.message });
        })(req, res, next);
    },

    googleLogin: async (req, res, next) => {
        passport.authenticate('google', { session: false, scope: ['profile', 'email'] })(req, res, next);
    },

    googleCallback: async (req, res, next) => {
        passport.authenticate('google', { session: false}, callback(req, res))(req, res, next);
    },

    facebookLogin: async (req, res, next) => {
        passport.authenticate('facebook', { session: false, scope: ['public_profile'] })(req, res, next);
    },

    facebookCallback: async (req, res, next) => {
        passport.authenticate('facebook', { session: false }, callback(req, res))(req, res, next);
    },

    logout: async (req, res) => {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.status(200).json({ message: 'Logged out successfully' });
    },

    refreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'You are not authenticated' });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            const accessToken = jwt.sign(
                { id: user.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 30 * 60 * 1000
            });

            res.status(200).json({ accessToken });
        });
    }
}