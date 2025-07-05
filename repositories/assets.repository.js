const Asset = require('../models/assets.model');

async function getSounds() {
  try {
    const sounds = await Asset.find({ category: 'sound' });
    return sounds.map((sound) => sound.detail);
  } catch (error) {
    console.error('Error fetching sounds:', error);
    throw new Error('Failed to fetch sounds');
  }
}

async function getVoices() {
  try {
    const voices = await Asset.find({ category: 'voice' });
    return voices.map((voice) => voice.detail);
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw new Error('Failed to fetch voices');
  }
}

async function getFonts() {
  try {
    const fonts = await Asset.find({ category: 'font' });
    return fonts.map((font) => font.detail);
  } catch (error) {
    console.error('Error fetching fonts:', error);
    throw new Error('Failed to fetch fonts');
  }
}

async function getStickers() {
  try {
    const stickers = await Asset.find({ category: 'sticker' });
    return stickers.map((sticker) => sticker.detail);
  } catch (error) {
    console.error('Error fetching stickers:', error);
    throw new Error('Failed to fetch stickers');
  }
}

module.exports = {
  getSounds,
  getVoices,
  getFonts,
  getStickers,
};
