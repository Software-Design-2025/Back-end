const mongoose = require('mongoose');

const scenesSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    audio: {
        type: String,
        required: true
    },
    script: {
        type: String,
        required: true
    }
}, { _id: false });

const videosSchema = new mongoose.Schema({
    url: {
        type: String
    },
    scenes: {
        type: [scenesSchema],
        default: []
    },
    is_public: {
        type: Boolean,
        default: false
    }
})

const Videos = mongoose.models.videos || mongoose.model('videos', videosSchema);
module.exports = Videos;