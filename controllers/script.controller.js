const { sendPromptToGemini } = require('../config/AIModel.config');

async function generateVideoScriptController(req, res) {
  try {
    const { topic, description, style, duration } = req.body;
    if (!topic || !description || !style || !duration) {
      return res.status(400).json({ error: 'Topic, description, style and duration are required' });
    }

    const prompt = `
      You are an expert video scriptwriter and visual director. Your task is to create a detailed video script on a specified topic, adhering to a particular style and duration.
      The final output should be a sequence of scenes. Each scene must include:
      - imagePrompt: A detailed description of the visuals, suitable for an AI image or video generator. This should include details on the subject, setting, composition, camera angle, lighting, and overall mood.
      - contentText: The corresponding voiceover script for that scene. The language should be clear, engaging, and paced appropriately for the specified duration.
      Here are the core requirements for the video:
      - Topic: ${topic}
      - Style: ${style}
      - Duration: ${duration} seconds
      - Description: ${description}
    `

    const text = await sendPromptToGemini(prompt);

    let jsonString = text;
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    }

    let jsonResult;
    try {
      jsonResult = JSON.parse(jsonString);
    } catch (e) {
      return res
        .status(500)
        .json({ error: 'AI response is not valid JSON', raw: jsonString });
    }

    return res.json({ result: jsonResult });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

module.exports = {
  generateVideoScriptController,
};
