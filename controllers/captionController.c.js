const { AssemblyAI } = require("assemblyai");

async function generateCaption(req, res) {
    try {
        const { audioFileUrl } = req.body;
        const client = new AssemblyAI({
            apiKey: process.env.CAPTION_API_KEY,
        });

        const params = {
            audio: audioFileUrl,
            speech_model: "universal",
        };

        const transcript = await client.transcripts.transcribe(params);
        console.log(transcript.words);
        return res.json(transcript.words);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { generateCaption };
