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
    },

    createTranscription: async (audio) => {
        try {
            const transcription = await groq.audio.transcriptions.create({
                url: audio,
                model: "whisper-large-v3-turbo",
                response_format: "verbose_json", 
                timestamp_granularities: ["segment"], 
                language: "en"
            });

            const toTimestamp = (seconds) => {
                const hrs = Math.floor(seconds / 3600);
                const mins = Math.floor((seconds % 3600) / 60);
                const secs = Math.floor(seconds % 60);
                const millis = Math.floor((seconds % 1) * 1000);

                const pad = (num, size) => String(num).padStart(size, '0');

                return `${pad(hrs, 2)}:${pad(mins, 2)}:${pad(secs, 2)}.${pad(millis, 3)}`;
            }

            let subtitle = 'WEBVTT\n\n'

            for (const segment of transcription.segments) {
                start = toTimestamp(segment.start);
                end = toTimestamp(segment.end);
                subtitle += `${start} --> ${end}\n`;
                subtitle += `${segment.text}\n\n`;
            }

            const url = await upload(Buffer.from(subtitle), 'raw', 'vtt');
            return url;
        }
        catch (error) {
            throw error;
        }
    }
}