const UsersM = require('../models/users.m');
const upload = require('../helpers/cloud-upload.h');
const cloudinary = require('../config/cloudinary.config');

module.exports = {
    updateAvatar: async (req, res) => {
        try {
            const avatar = await upload(req.file.buffer, 'image', 'png');
            const id = req.params.id;
            const user = await UsersM.findOne(id);

            if (user.avatar != process.env.DEFAULT_AVATAR) {
                await cloudinary.uploader.destroy(user.avatar.split('/').pop().split('.')[0], { invalidate: true });
            }

            const success = UsersM.updateOne(id, { avatar });
            if (!success) {
                return res.status(400).json({ message: 'Failed to update avatar' });
            }
            return res.status(200).json({
                message: 'Avatar updated successfully'
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const success = await UsersM.updateOne(req.params.id, { fullname: req.body.fullname });
            if (!success) {
                return res.status(400).json({ message: 'Failed to update profile' });
            }
            return res.status(200).json({
                message: 'Profile updated successfully'
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}