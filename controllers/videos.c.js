const VideosM = require('../models/videos.m');

module.exports = {
    getVideoByID: async (req, res) => {
        try {
            const video = await VideosM.findOne(req.params.id);
            if (!video) {
                return res.status(404).json({ message: 'Video not found' });
            }
            return res.status(200).json(video);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getPublicVideos: async (req, res) => {
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
}