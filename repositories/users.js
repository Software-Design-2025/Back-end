const User = require('../models/users.m');

async function insertCreatedVideo(userId, videoId) {
    try {
        await User.findByIdAndUpdate(userId, {
            $push: { 
                created_videos: videoId 
            }
        });
    }
    catch (error) {
        console.error('Error inserting created video:', error);
        throw error;
    }
}

module.exports = {
    insertCreatedVideo
};