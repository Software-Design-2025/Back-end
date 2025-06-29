const groq = require('../config/groq.config');
const { 
    v4: uuidv4 
} = require('uuid');
const {
    ref,
    getDownloadURL, 
    uploadBytes 
} = require('firebase/storage');
const { 
    storage 
} = require('../config/FirebaseConfigs.config');

async function createAudio(voice, scene) {
    try {
        const response = await groq.audio.speech.create({
            model: 'playai-tts',
            voice: voice,
            input: scene.script,
            response_format: 'mp3'
        });
    
        const buffer = Buffer.from(await response.arrayBuffer());
        const filename = `${uuidv4()}.mp3`;
        const storageRef = ref(storage, `ai-short-video-files/audio/${filename}`);
        await uploadBytes(storageRef, buffer, { contentType: 'audio/mpeg' });
        scene.audio = await getDownloadURL(storageRef);
        return scene;
    }
    catch (error) {
        console.error('Error creating audio:', error);
        throw error;
    }
}

async function createAudiosController(req, res, next) {
    try {
        const { voice, scenes } = req.body;
        const promises = scenes.map(scene => createAudio(voice, scene));
        req.scenes = await Promise.all(promises);
        next();
    }
    catch (error) {
        console.error('Error in createAudiosController:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createAudiosController
}