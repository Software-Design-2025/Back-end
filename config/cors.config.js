require('dotenv').config();

const whitelist = process.env.CORS_ORIGINS.split(',');

module.exports = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    }
}