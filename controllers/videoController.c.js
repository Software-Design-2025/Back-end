const VideoData = require("../models/VideoData");
const connectDB = require("../config/db.config");
const mongoose = require("mongoose");

async function saveVideoData(req, res) {
    try {
        await connectDB();
        const body = req.body;
        const { script, audioFileUrl, captions, imageList, createdBy } = body;

        if (!script || !audioFileUrl || !captions || !imageList || !createdBy) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const newVideo = await VideoData.create({
            script, 
            audioFileUrl,
            captions,
            imageList,
            createdBy,
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

module.exports = {
    saveVideoData,
    getVideoData,
    getVideosByCreatedBy,
};
