const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  subscription: {
    type: Boolean,
    default: false
  },
  credits: {
    type: Number,
    default: 30
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;