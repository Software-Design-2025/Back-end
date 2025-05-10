const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({ 
    apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY,
});

module.exports = { ai, Type};