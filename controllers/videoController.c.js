const VideoData = require("../models/VideoData");
const connectDB = require("../config/db.config");
const mongoose = require("mongoose");
const FavoriteVideo = require('../models/FavoriteVideo');
const VideoEditConfig = require('../models/VideoEdit');

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
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: "Missing email" });
    }

    const videos = await VideoData.find({ createdBy: email });
    return res.json(videos);
}

async function getPublicVideos(req, res) {
    try {
        await connectDB();
        const videos = await VideoData.find({ public: true });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
}

async function addFavoriteVideo (req, res) {
    await connectDB();
    const { userEmail, videoId } = req.body;
    if (!userEmail || !videoId) {
        return res.status(400).json({ error: 'userEmail and videoId are required' });
    }
    try {
        const exists = await FavoriteVideo.findOne({ userEmail, videoId });
        if (exists) {
            return res.status(409).json({ message: 'Video already in favorites' });
        }
        const favorite = new FavoriteVideo({ userEmail, videoId });
        await favorite.save();
        res.json({ message: 'Added to favorites', favorite });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

async function removeFavoriteVideo (req, res) {
    await connectDB();
    const { userEmail, videoId } = req.body;
    if (!userEmail || !videoId) {
        return res.status(400).json({ error: 'userEmail and videoId are required' });
    }
    try {
        const result = await FavoriteVideo.findOneAndDelete({ userEmail, videoId });
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
    const { userEmail } = req.query;
    if (!userEmail) {
        return res.status(400).json({ error: 'userEmail is required' });
    }
    try {
        const favorites = await FavoriteVideo.find({ userEmail });
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

module.exports = {
    saveVideoData,
    getVideoData,
    getVideosByCreatedBy,
    getPublicVideos,
    addFavoriteVideo,
    removeFavoriteVideo,
    getFavoriteVideos,
    updateVideoPublicStatus,
    saveVideoEditConfig
};
