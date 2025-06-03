const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: {
        type: String,
        unique: true
    },
    avatar: {
        type: String,
        default: 'https://i.pinimg.com/736x/2a/53/70/2a5370c752b7f4bd65766f3550afdb5d.jpg'
    },
    profile_id: String,
    provider: {
        type: String,
        enum: ['google', 'facebook', 'local'],
        default: 'local'
    }
});

module.exports = mongoose.models.users || mongoose.model('users', usersSchema);