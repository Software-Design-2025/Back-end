const Video = require('../models/videos.m');

async function insertVideo(scences) {
    try {
        const video = new Video({
            scenes: scences,
            is_public: false,
            is_deleted: false
        });
        await video.save();
        return video;
    }
    catch (error) {
        console.error('Error inserting video:', error);
        throw error;
    }
}

module.exports = {
    insertVideo
};