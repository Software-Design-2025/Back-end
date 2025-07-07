const mongoose = require('mongoose');
const User = require('./users.model');

const tokensSchema = new mongoose.Schema(
  {
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
    },
  },
  { _id: false }
);

const videosSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const socialAccountSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User.modelName,
    required: true,
  },
  platform: {
    type: String,
    enum: ['youtube', 'tiktok'],
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  account_id: {
    type: String,
    required: true,
  },
  tokens: {
    type: tokensSchema,
    required: true,
  },
  videos: {
    type: [videosSchema],
    default: [],
  },
  avatar: String,
});

module.exports =
  mongoose.models.social_accounts ||
  mongoose.model('social_accounts', socialAccountSchema);
