const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: String,
    password: String,
    email: String,
    avatar: {
        type: String,
        default: 'https://i.pinimg.com/736x/2a/53/70/2a5370c752b7f4bd65766f3550afdb5d.jpg'
    },
    profile_id: String,
    provider: {
        type: String,
        enum: ['google', 'facebook', 'local'],
        default: 'local'
    },
    created_videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videos',
        default: []
    }],
    favorite_videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videos',
        default: []
    }]
});

module.exports = mongoose.models.users || mongoose.model('users', usersSchema);