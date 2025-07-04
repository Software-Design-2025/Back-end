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

async function getCreatedVideos(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user.created_videos;
    }
    catch (error) {
        console.error('Error retrieving created videos:', error);
        throw error;
    }
}

async function getFavoriteVideos(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user.favorite_videos;
    }
    catch (error) {
        console.error('Error retrieving favorite videos:', error);
        throw error;
    }
}

async function insertFavoriteVideo(userId, videoId) {
    try {
        await User.findByIdAndUpdate(userId, {
            $push: { 
                favorite_videos: videoId
            }
        });
    }
    catch (error) {
        console.error('Error inserting favorite video:', error);
        throw error;
    }
}

async function removeFavoriteVideo(userId, videoId) {
    try {
        await User.findByIdAndUpdate(userId, {
            $pull: { 
                favorite_videos: videoId
            }
        });
    }
    catch (error) {
        console.error('Error removing favorite video:', error);
        throw error;
    }
}

module.exports = {
    insertCreatedVideo,
    getCreatedVideos,
    getFavoriteVideos,
    insertFavoriteVideo,
    removeFavoriteVideo
};