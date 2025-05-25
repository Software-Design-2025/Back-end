const { storage } = require('../config/FirebaseConfigs.config');
const textToSpeech = require('@google-cloud/text-to-speech');
const { ref, getDownloadURL, uploadBytes } = require('firebase/storage');
const { Buffer } = require('buffer');

const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY
});

async function generateAudio(req, res) {
    try {
        const { text, id } = req.body;
        const storageRef = ref(storage, 'ai-short-video-files/' + id + '.mp3');
        const request = {
            input: { text: text },
            voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
            audioConfig: { audioEncoding: 'MP3' },
        };
        const [response] = await client.synthesizeSpeech(request);
        const audioBuffer = Buffer.from(response.audioContent, 'binary');
        await uploadBytes(storageRef, audioBuffer, { contentType: 'audio/mp3' });

        const downloadUrl = await getDownloadURL(storageRef);
        console.log(downloadUrl);
        return res.json({ Result: downloadUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { generateAudio };
