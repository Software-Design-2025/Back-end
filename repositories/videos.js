const Video = require('../models/videos.m');
const mongoose = require('mongoose');

async function insertVideo({ 
    url: url, 
    scenes: scences 
}) {
    try {
        const video = new Video({
            url: url,
            scenes: scences,
            is_public: false
        });
        await video.save();
        return video;
    }
    catch (error) {
        console.error('Error inserting video:', error);
        throw error;
    }
}

async function getVideos(videos) {
    try {
        const results = await Video.aggregate([
            {
                $match: {
                    _id: { $in: videos }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { videoId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$$videoId', '$created_videos'] }
                            }
                        },
                        {
                            $project: {
                                fullname: 1,
                                avatar: 1,
                                username: 1
                            }
                        }
                    ],
                    as: 'creator'
                }
            },
            {
                $unwind: {
                    path: '$creator',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    url: 1,
                    user: '$creator',
                    thumbnail: { $arrayElemAt: ['$scenes.image', 0] }
                }
            }
        ]);

        return results;
    }   
    catch (error) {
        console.error('Error fetching videos by IDs:', error);
        throw error;
    }
}

async function getPublicVideos() {
    try {
        const results = await Video.aggregate([
            {
                $match: {
                    is_public: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { videoId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$$videoId', '$created_videos'] }
                            }
                        },
                        {
                            $project: {
                                fullname: 1,
                                avatar: 1,
                                username: 1
                            }
                        }
                    ],
                    as: 'creator'
                }
            },
            {
                $unwind: {
                    path: '$creator',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    url: 1,
                    user: '$creator',
                    thumbnail: { $arrayElemAt: ['$scenes.image', 0] }
                }
            }
        ]);

        return results;
    }   
    catch (error) {
        console.error('Error fetching videos by IDs:', error);
        throw error;
    }     
}

async function setPublicVideo(videoId, isPublic) {
    try {
        const result = await Video.updateOne(
            { _id: videoId },
            { $set: { is_public: isPublic } }
        );
        return result;
    }
    catch (error) {
        console.error('Error updating video visibility:', error);
        throw error;
    }
}

async function deleteVideo(videoId) {
    try {
        const result = await Video.deleteOne({ _id: videoId });
        return result;
    }
    catch (error) {
        console.error('Error deleting video:', error);
        throw error;
    }
}

module.exports = {
    insertVideo,
    getVideos,
    getPublicVideos,
    setPublicVideo,
    deleteVideo
};