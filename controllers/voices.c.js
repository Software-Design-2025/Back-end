const VoicesM = require('../models/voices.m');
const groq = require('../config/groq.config');
const { v4: uuidv4 } = require('uuid');
const { ref, getDownloadURL, uploadBytes } = require('firebase/storage');
const { storage } = require('../config/FirebaseConfigs.config');

module.exports = {
    getSampleVoices: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const per_page = parseInt(req.query.per_page) || 5;
            const data = await VoicesM.find()
                .skip((page - 1) * per_page)
                .limit(per_page);
            const totalItems = await VoicesM.countDocuments();
            const totalPages = Math.ceil(totalItems / per_page);
            if (page > totalPages || page < 1) {
                return res.status(400).json({ message: 'Invalid page number' });
            }
            return res.status(200).json({
                total_items: totalItems,
                total_pages: totalPages,
                current_page: page,
                per_page: per_page,
                voices: data
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    createVoice: async (req, res) => {
        try {
            if (!req.body.text) {
                return res.status(400).json({ message: 'Text is required' });
            }

            const voice = req.body.voice || 'Arista-PlayAI';
            const response = await groq.audio.speech.create({
                model: 'playai-tts',
                voice: voice,
                input: req.body.text,
                response_format: 'mp3'
            });
    
            const buffer = Buffer.from(await response.arrayBuffer());
            const filename = `${uuidv4()}.mp3`;
            const storageRef = ref(storage, `ai-short-video-files/audio/${filename}`);
            await uploadBytes(storageRef, buffer, { contentType: 'audio/mpeg' });
            const url = await getDownloadURL(storageRef);
            return res.status(200).json({
                url: url
            });
        }
        catch (error) {
            console.error('Error creating voice:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}