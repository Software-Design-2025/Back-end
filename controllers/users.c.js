const User = require("../models/User");
const UsersM = require('../models/users.m');
const connectDB = require("../config/db.config");
const upload = require('../helpers/cloud-upload.h');
const cloudinary = require('../config/cloudinary.config');
const { ObjectId } = require("mongodb");

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

// Update avatar (UsersM model)
async function updateAvatar(req, res) {
    try {
        const avatar = await upload(req.file.buffer, 'image', 'png');
        const id = req.params.id;
        const user = await UsersM.findOne({ _id: ObjectId.createFromHexString(id) });

        if (user.avatar != process.env.DEFAULT_AVATAR) {
            await cloudinary.uploader.destroy(user.avatar.split('/').pop().split('.')[0], { invalidate: true });
        }

        const success = await UsersM.updateOne(id, { avatar });
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
}

// Update profile (UsersM model)
async function updateProfile(req, res) {
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

// Get user (UsersM model)
async function getUser(req, res) {
    try {
        const user = await UsersM.findOne({ _id: ObjectId.createFromHexString(req.params.id) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
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

module.exports = {
    updateUserCredits,
    getUserDetail,
    updateAvatar,
    updateProfile,
    getUser
};
