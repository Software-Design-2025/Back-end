const mongoose = require("mongoose");

const videoDataSchema = new mongoose.Schema({
  script: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  audioFileUrl: {
    type: String,
    required: true
  },
  captions: {
    type: mongoose.Schema.Types.Mixed,  
    required: true
  },
  imageList: {
    type: [String],  
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  public: { 
    type: Boolean, 
    default: false 
  },
  videoOutputUrl: {
    type: String,
    default: ''
  },
});

const VideoData = mongoose.models.VideoData || mongoose.model('VideoData', videoDataSchema);

module.exports = VideoData;
