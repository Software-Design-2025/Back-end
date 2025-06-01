const mongoose = require('mongoose');

const FavoriteVideoSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    videoId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FavoriteVideo', FavoriteVideoSchema);
