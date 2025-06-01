const mongoose = require('mongoose');

const VideoEditConfigSchema = new mongoose.Schema({
    videoId: { type: String, required: true, unique: true },
    fontFamily: { type: String, required: true },
    fontSize: { type: Number, required: true },
    textColor: { type: String, required: true },
    textAnimation: { type: String, required: true },
    bgAnimation: { type: String, required: true },
    sticker: { type: String },
    stickerWidth: { type: Number }, 
    stickerHeight: { type: Number }, 
    audioUrl: { type: String },
    screenSize: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('VideoEditConfig', VideoEditConfigSchema);
