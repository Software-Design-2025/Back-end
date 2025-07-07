const { ai, Type } = require('../config/google-ai.config');

async function getTopicUsingAIController(req, res) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `
                  Provide a list of the top 10 trending topics on social media platforms — TikTok, YouTube Shorts, Instagram Reels, and Facebook — that are associated with the keyword "${req.query.keyword}". 
                  For each topic, include the following fields: 
                  - no: The number of the topic
                  - topic: The title of the topic
                  - description: A brief description of the topic`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              no: { type: Type.NUMBER },
              topic: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            propertyOrdering: ['no', 'topic', 'description'],
          },
        },
      },
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error(
        "Invalid API response structure: Missing 'text' property."
      );
    }
    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getTopicUsingSpringerNatureController(req, res) {
  try {
    const keyword = req.query.keyword;
    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required.' });
    }

    let url = 'https://api.springernature.com/openaccess/json';
    url += `?api_key=${process.env.SPRINGER_API_KEY}`;
    url += `&q=keyword${encodeURIComponent(':' + keyword)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const records = data.records.map((record) => {
      return {
        id: record.identifier,
        title: record.title,
        url: record.url[0].value,
        abstract: record.abstract.p,
      };
    });

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getTopicUsingAIController,
  getTopicUsingSpringerNatureController,
};
