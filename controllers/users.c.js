const Users = require('../models/users.m');
const { ObjectId } = require("mongodb");
const { storage } = require('../config/FirebaseConfigs.config');
const { ref, deleteObject, getDownloadURL, uploadBytes } = require('firebase/storage');

module.exports = {
    updateAvatar: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await Users.findOne({ _id: ObjectId.createFromHexString(id) });
            const storageRef = ref(storage, `ai-short-video-files/avatars/${id}.png`);

            if (user.avatar.startsWith('https://firebasestorage.googleapis.com/v0/b/ai-short-video-generator-56c7e.firebasestorage.app')) {
                await deleteObject(storageRef);
            }

            await uploadBytes(storageRef, req.file.buffer, { contentType: 'image/png' });
            const avatar = await getDownloadURL(storageRef);

            await Users.findOneAndUpdate(
                { _id: ObjectId.createFromHexString(id) },
                { avatar: avatar}
            );

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
            const success = await Users.findOneAndUpdate(
                { _id: ObjectId.createFromHexString(req.params.id)},
                { fullname: req.body.fullname }
            );

            return res.status(200).json({
                message: 'Profile updated successfully'
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await Users.findOne({ _id: ObjectId.createFromHexString(req.params.id) });

            return res.status(200).json({
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}