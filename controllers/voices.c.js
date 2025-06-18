const VoicesM = require('../models/voices.m');

module.exports = {
    getSampleVoices: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const per_page = parseInt(req.query.per_page) || 5;
            const data = await VoicesM.find()
                .skip((page - 1) * per_page)
                .limit(per_page);
            const total = await VoicesM.countDocuments();
            if (page > data.total_pages) {
                return res.status(400).json({ message: 'Invalid page number' });
            }
            return res.status(200).json({
                total_items: total,
                total_pages: Math.ceil(total / per_page),
                current_page: page,
                per_page: per_page,
                voices: data
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}