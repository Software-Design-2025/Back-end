const { storage } = require('../config/firebase.config');
const {
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytes,
} = require('firebase/storage');

const {
  getUserById,
  updateUserById,
} = require('../repositories/users.repository');

async function updateAvatarController(req, res) {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    const storageRef = ref(storage, `ai-short-video-files/avatars/${id}.png`);

    if (
      user.avatar.startsWith(
        'https://firebasestorage.googleapis.com/v0/b/ai-short-video-generator-56c7e.firebasestorage.app'
      )
    ) {
      await deleteObject(storageRef);
    }

    await uploadBytes(storageRef, req.file.buffer, {
      contentType: 'image/png',
    });
    const avatar = await getDownloadURL(storageRef);

    await updateUserById(id, { avatar });

    return res.status(200).json({
      message: 'Avatar updated successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateProfileController(req, res) {
  try {
    await updateUserById(req.params.id, {
      fullname: req.body.fullname,
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getUserController(req, res) {
  try {
    const user = await getUserById(req.params.id);

    return res.status(200).json({
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  updateAvatarController,
  updateProfileController,
  getUserController,
};
