const groq = require('../config/groq.config');
const upload = require('../helpers/cloud-upload.h');
const VoicesM = require('../models/voices.m');

module.exports = {
    getSampleVoices: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 5;
        const data = await VoicesM.find(page, per_page);
        if (page > data.total_pages) {
            return res.status(400).json({ message: 'Invalid page number' });
        }
        return res.status(200).json(data);
    },

}