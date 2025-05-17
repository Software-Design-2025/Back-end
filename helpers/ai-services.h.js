const groq = require('../config/groq.config');
const upload = require('../helpers/cloud-upload.h');

module.exports = {
    createSpeech: async (text, voice = 'Arista-PlayAI') => {
        try {
            const response = await groq.audio.speech.create({
                model: 'playai-tts',
                voice: voice,
                input: text,
                response_format: 'mp3'
            });
    
            const buffer = Buffer.from(await response.arrayBuffer());
            const url = await upload(buffer, 'video', 'mp3');
            return url;
        }
        catch (error) {
            throw error;
        }
    }
}