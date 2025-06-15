const { storage } = require('../config/FirebaseConfigs.config');
const textToSpeech = require('@google-cloud/text-to-speech');
const { ref, getDownloadURL, uploadBytes } = require('firebase/storage');
const { Buffer } = require('buffer');

const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY
});

async function uploadAudioToFirebase (req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        let blob = req.file.buffer;
        const filename = req.body.filename || req.file.originalname;

        if (!blob || !Buffer.isBuffer(blob) || blob.length === 0) {
            return res.status(400).json({ error: 'Audio blob is empty or invalid' });
        }

        const storageRef = ref(storage, 'ai-short-video-files/' + filename);

        try {
            const url = await getDownloadURL(storageRef);
            return res.json({ url });
        } catch (err) {
            if (err.code !== 'storage/object-not-found') throw err;
            await uploadBytes(storageRef, blob, { contentType: req.file.mimetype || 'audio/mp3' });
            const downloadUrl = await getDownloadURL(storageRef);
            return res.json({ url: downloadUrl });
        }
    } catch (e) {
        console.error('uploadAudioToFirebase error:', e);
        res.status(500).json({ error: e.message });
    }
};

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

async function getAudioLink(req, res) {
    try {
        let name = req.query.name;
        if (!name) {
            return res.status(400).json({ error: "Missing name param" });
        }
        if (!name.toLowerCase().endsWith(".mp3")) {
            name = name + ".mp3";
        }
        const nameMap = {
            "happy.mp3": "Happy.mp3",
            "piano.mp3": "Piano.mp3",
            "violin.mp3": "Violin.mp3"
        };
        name = nameMap[name.toLowerCase()] || name;

        const storageRef = ref(storage, 'ai-short-video-files/' + name);
        try {
            const url = await getDownloadURL(storageRef);
            return res.status(200).json({ url });
        } catch (err) {
            return res.status(404).json({ error: "Not found" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = { 
    generateAudio,
    uploadAudioToFirebase,
    getAudioLink
};
