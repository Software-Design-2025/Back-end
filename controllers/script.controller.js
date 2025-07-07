const { sendPromptToGemini } = require('../config/AIModel.config');

async function generateVideoScriptController(req, res) {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

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
