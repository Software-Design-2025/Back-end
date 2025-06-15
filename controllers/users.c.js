const User = require("../models/User");
const UsersM = require('../models/users.m');
const connectDB = require("../config/db.config");
const upload = require('../helpers/cloud-upload.h');
const cloudinary = require('../config/cloudinary.config');
const Users = require('../models/users.m');
const { ObjectId } = require("mongodb");
const { storage } = require('../config/FirebaseConfigs.config');
const { ref, deleteObject, getDownloadURL, uploadBytes } = require('firebase/storage');

// Update credits (MongoDB User model)
async function updateUserCredits(req, res) {
    try {
        await connectDB();
        const { id, credits } = req.body;
        if (!id || typeof credits !== "number") {
            return res.status(400).json({ error: "Missing or invalid params" });
        }
        const result = await User.findByIdAndUpdate(
            id,
            { credits },
            { new: true }
        );
        return res.json({ success: true, result });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

async function updateAvatar(req, res) {
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
}

async function updateProfile(req, res) {
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
}

async function getUser(req, res) {
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

// Get user detail (MongoDB User model)
async function getUserDetail(req, res) {
    await connectDB();
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: "Missing id" });
    }
    const user = await User.findById(id);
    return res.json(user || null);
}

module.exports = {
    updateUserCredits,
    getUserDetail,
    updateAvatar, 
    updateProfile, 
    getUser, 
};
