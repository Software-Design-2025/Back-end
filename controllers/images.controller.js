const Replicate = require('replicate');
const { storage } = require('../config/firebase.config');
const { getDownloadURL, ref, uploadString } = require('firebase/storage');
const axios = require('axios');

const convertImage = async (imageUrl) => {
  try {
    const resp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(resp.data).toString('base64');
    return base64Image;
  } catch (error) {
    console.log('Error ', error);
  }
};

async function generateImageController(req, res) {
  try {
    const { prompt, width, height } = req.body;
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: prompt,
      height: height || 1280,
      width: width || 720,
      num_outputs: 1,
    };

    let prediction = await replicate.predictions.create({
      version:
        '6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe',
      input: input,
    });

    while (
      prediction.status !== 'succeeded' &&
      prediction.status !== 'failed' &&
      prediction.status !== 'canceled'
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      prediction = await replicate.predictions.get(prediction.id);
    }

    const base64Image =
      'data:image/png;base64,' + (await convertImage(prediction.urls.stream));

    const fileName = 'ai-short-video-files/' + Date.now() + '.png';
    const storageRef = ref(storage, fileName);

    await uploadString(storageRef, base64Image, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);

    return res.json({ result: downloadUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  generateImageController,
};
