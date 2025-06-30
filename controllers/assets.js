const { 
    getSounds,
    getVoices,
    getFonts
} = require('../repositories/assets');

async function getSoundsController(req, res) {
    try {
        const sounds = await getSounds();
        return res.status(200).json(sounds);
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch sounds' });
    }
}

async function getVoicesController(req, res) {
    try {
        const voices = await getVoices();
        return res.status(200).json(voices);
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch voices' });
    }
}

async function getFontsController(req, res) {
    try {
        const fonts = await getFonts();
        return res.status(200).json(fonts);
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch fonts' });
    }
}

module.exports = {
    getSoundsController,
    getVoicesController,
    getFontsController
};