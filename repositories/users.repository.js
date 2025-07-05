const User = require('../models/users.model');

async function insertCreatedVideo(userId, videoId) {
  try {
    await User.findByIdAndUpdate(userId, {
      $push: {
        created_videos: videoId,
      },
    });
  } catch (error) {
    console.error('Error inserting created video:', error);
    throw error;
  }
}

async function getCreatedVideos(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.created_videos;
  } catch (error) {
    console.error('Error retrieving created videos:', error);
    throw error;
  }
}

async function getFavoriteVideos(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.favorite_videos;
  } catch (error) {
    console.error('Error retrieving favorite videos:', error);
    throw error;
  }
}

async function insertFavoriteVideo(userId, videoId) {
  try {
    await User.findByIdAndUpdate(userId, {
      $push: {
        favorite_videos: videoId,
      },
    });
  } catch (error) {
    console.error('Error inserting favorite video:', error);
    throw error;
  }
}

async function removeFavoriteVideo(userId, videoId) {
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: {
        favorite_videos: videoId,
      },
    });
  } catch (error) {
    console.error('Error removing favorite video:', error);
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw error;
  }
}

async function insertUser(user) {
  try {
    const newUser = new User(user);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error retrieving user by ID:', error);
    throw error;
  }
}

async function updateUserById(userId, updateData) {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user by ID:', error);
    throw error;
  }
}

module.exports = {
  insertCreatedVideo,
  getCreatedVideos,
  getFavoriteVideos,
  insertFavoriteVideo,
  removeFavoriteVideo,
  getUserByUsername,
  getUserByEmail,
  insertUser,
  getUserById,
  updateUserById,
};
