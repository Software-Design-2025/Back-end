const VideoData = require("../models/VideoData");
const connectDB = require("../config/db.config");
const mongoose = require("mongoose");
const FavoriteVideo = require('../models/FavoriteVideo');
const VideoEditConfig = require('../models/VideoEdit');
const VideosM = require('../models/videos.m');

async function saveVideoData(req, res) {
    try {
        await connectDB();
        const body = req.body;
        const { script, audioFileUrl, captions, imageList, createdBy, public } = body;

        if (!script || !audioFileUrl || !captions || !imageList || !createdBy || public === undefined) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const newVideo = await VideoData.create({
            script, 
            audioFileUrl,
            captions,
            imageList,
            createdBy,
            public,
        });

        return res.json({ id: newVideo._id });
    } catch (error) {
        console.error("Lỗi API:", error);
        return res.status(500).json({ error: error.message });
    }
}

async function getVideoData(req, res) {
    try {
        await connectDB();
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: "Missing id" });

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }

        const video = await VideoData.findById(id).lean();
        if (!video) return res.status(404).json({ error: "Not found" });

        return res.json(video);
    } catch (error) {
        console.error("Lỗi lấy video:", error);
        return res.status(500).json({ error: error.message });
    }
}

async function getVideosByCreatedBy(req, res) {
    await connectDB();
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: "Missing id" });
    }
    const videos = await VideoData.find({ createdBy: id });
    return res.json(videos);
}

async function getPublicVideos(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const videos = await VideoData.aggregate([
            { $match: { public: true } },
            {
                $addFields: {
                    createdByObjectId: { $toObjectId: '$createdBy' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdByObjectId',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {
                $unwind: '$creator'
            },
            {
                $project: {
                    _id: 1,
                    'creator._id': 1,
                    'creator.username': 1,
                    'creator.fullname': 1,
                    'creator.avatar': 1,
                    videoOutputUrl: 1,
                    thumbnail: { $arrayElemAt: ['$imageList', 0] }
                }
            },
            { $skip: skip },
            { $limit: limit }
        ])
        const total = await VideoData.countDocuments({ public: true });
        
        return res.status(200).json({
            page: page,
            per_page: limit,
            total_items: total,
            total_pages: Math.ceil(total / limit),
            videos: videos
        });
    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}

async function addFavoriteVideo (req, res) {
    await connectDB();
    const { userId, videoId } = req.body;
    if (!userId || !videoId) {
        return res.status(400).json({ error: 'userId and videoId are required' });
    }
    try {
        const exists = await FavoriteVideo.findOne({ userId, videoId });
        if (exists) {
            return res.status(409).json({ message: 'Video already in favorites' });
        }
        const favorite = new FavoriteVideo({ userId, videoId });
        await favorite.save();
        res.json({ message: 'Added to favorites', favorite });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

async function removeFavoriteVideo (req, res) {
    await connectDB();
    const { userId, videoId } = req.body;
    if (!userId || !videoId) {
        return res.status(400).json({ error: 'userId and videoId are required' });
    }
    try {
        const result = await FavoriteVideo.findOneAndDelete({ userId, videoId });
        if (!result) {
            return res.status(404).json({ message: 'Favorite video not found' });
        }
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

async function getFavoriteVideos (req, res) {
    await connectDB();
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    try {
        const favorites = await FavoriteVideo.find({ userId });
        const videoIds = favorites.map(fav => fav.videoId);
        const videos = await VideoData.find({ _id: { $in: videoIds } });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

async function updateVideoPublicStatus (req, res) {
    const { videoId, public: isPublic } = req.body;
    if (!videoId || typeof isPublic !== 'boolean') {
        return res.status(400).json({ error: 'videoId and public(boolean) are required' });
    }
    try {
        const updated = await VideoData.findByIdAndUpdate(
            videoId,
            { public: isPublic },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json({ message: 'Video public status updated', video: updated });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

async function saveVideoEditConfig (req, res) {
    try {
        await connectDB();
        const {
            videoId,
            fontFamily,
            fontSize,
            textColor,
            textAnimation,
            bgAnimation,
            sticker,
            stickerWidth,
            stickerHeight,
            audioUrl,
            screenSize
        } = req.body;

        if (!videoId) {
            return res.status(400).json({ error: "Missing videoId" });
        }

        let config = await VideoEditConfig.findOne({ videoId });

        if (config) {
            // Update
            config.fontFamily = fontFamily;
            config.fontSize = fontSize;
            config.textColor = textColor;
            config.textAnimation = textAnimation;
            config.bgAnimation = bgAnimation;
            config.sticker = sticker;
            config.stickerWidth = stickerWidth;
            config.stickerHeight = stickerHeight;
            config.audioUrl = audioUrl;
            config.screenSize = screenSize;
            await config.save();
        } else {
            // Insert
            config = await VideoEditConfig.create({
                videoId,
                fontFamily,
                fontSize,
                textColor,
                textAnimation,
                bgAnimation,
                sticker,
                stickerWidth,
                stickerHeight,
                audioUrl,
                screenSize
            });
        }

        res.status(200).json({ success: true, data: config });
    } catch (e) {
        console.error("API save-video-edit error:", e);
        res.status(500).json({ error: e.message });
    }
};

async function saveLinkVideo(req, res) {
    try {
        const { videoId, videoOutputUrl } = req.body;
        if (!videoId || !videoOutputUrl) {
            return res.status(400).json({ error: "Missing videoId or videoOutputUrl" });
        }
        const result = await VideoData.findByIdAndUpdate(
            videoId,
            { videoOutputUrl },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ error: "Video not found" });
        }
        return res.status(200).json({ success: true, result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// Lấy video theo ID (VideosM model)
async function getVideoByID(req, res) {
    try {
        const video = await VideosM.findOne(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        return res.status(200).json(video);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Lấy danh sách video public có phân trang (VideosM model)
async function getPublicVideosV2(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const videos = await VideosM.findPublic(page, size);
        return res.status(200).json(videos);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    saveVideoData,
    getVideoData,
    getVideosByCreatedBy,
    getPublicVideos,
    addFavoriteVideo,
    removeFavoriteVideo,
    getFavoriteVideos,
    updateVideoPublicStatus,
    saveVideoEditConfig,
    saveLinkVideo,
    getVideoByID,
    getPublicVideosV2
};
