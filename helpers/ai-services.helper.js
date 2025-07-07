const groq = require('../config/groq.config');
const upload = require('./cloud-upload.helper');
const fs = require('fs');

module.exports = {
  createSpeech: async (text, voice = 'Arista-PlayAI') => {
    try {
      const response = await groq.audio.speech.create({
        model: 'playai-tts',
        voice: voice,
        input: text,
        response_format: 'mp3',
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      const url = await upload(buffer, 'video', 'mp3');
      return url;
    } catch (error) {
      throw error;
    }
  },

  transcribe: async (audio) => {
    try {
      const stream = fs.createReadStream(audio);
      const transcription = await groq.audio.transcriptions.create({
        file: stream,
        model: 'whisper-large-v3-turbo',
        response_format: 'verbose_json',
        timestamp_granularities: ['word'],
        language: 'en',
      });

      let segments = [];
      const wordsPerSegment = 10;
      const words = transcription.words;

      for (let i = 0; i < words.length; i += wordsPerSegment) {
        const group = words.slice(i, i + wordsPerSegment);
        segments.push({
          start: group[0].start,
          end: group[group.length - 1].end,
          text: group.map((ele) => ele.word).join(' '),
        });
      }

      return segments;
    } catch (error) {
      throw error;
    }
  },
};
