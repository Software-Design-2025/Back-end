const Asset = require('../models/assets.m');

async function getSounds() {
    try {
        const sounds = await Asset.find({ category: 'sound' });
        return sounds.map(sound => sound.detail);
    } catch (error) {
        console.error('Error fetching sounds:', error);
        throw new Error('Failed to fetch sounds');
    }
}

async function getVoices() {
    try {
        const voices = await Asset.find({ category: 'voice' });
        return voices.map(voice => voice.detail);
    } catch (error) {
        console.error('Error fetching voices:', error);
        throw new Error('Failed to fetch voices');
    }
}

async function getFonts() {
    try {
        const fonts = await Asset.find({ category: 'font' });
        return fonts.map(font => font.detail);
    } catch (error) {
        console.error('Error fetching fonts:', error);
        throw new Error('Failed to fetch fonts');
    }
}

module.exports = {
    getSounds,
    getVoices,
    getFonts
};