const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const assetsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['voice', 'sound', 'font', 'sticker'],
  },
  detail: {
    type: Object,
    required: true,
  },
});

const Asset = mongoose.models.assets || mongoose.model('assets', assetsSchema);

const ASSETS_DATA = [
  {
    category: 'voice',
    filename: 'voices.json',
  },
  {
    category: 'sound',
    filename: 'sounds.json',
  },
  {
    category: 'font',
    filename: 'fonts.json',
  },
  {
    category: 'sticker',
    filename: 'stickers.json',
  },
];

async function initAssetsCollection() {
  try {
    await Asset.deleteMany({});
    let assets = await Asset.find();

    let allData = [];
    for (const asset of ASSETS_DATA) {
      let data = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data', asset.filename), 'utf8')
      );
      data = data.map((item) => ({
        category: asset.category,
        detail: item,
      }));
      allData = allData.concat(data);
    }

    assets = await Asset.insertMany(allData);
    console.log('Assets collection initialized successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

initAssetsCollection();

module.exports = Asset;
