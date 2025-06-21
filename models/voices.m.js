const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const VoicesSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    display_name: { 
        type: String, 
        required: true 
    },
    url: { 
        type: String,
        required: true 
    }
}, { versionKey: false });

const Voices = mongoose.models.voices || mongoose.model('voices', VoicesSchema);
module.exports = Voices

async function initCollection() {
    try {
        let voices = await Voices.find();
        if (voices.length === 0) {
            const voicesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../_data/voices.json'), 'utf8')); 
            voices = await Voices.insertMany(voicesData);
        }
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

initCollection();