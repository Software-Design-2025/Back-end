const User = require("../models/User");
const connectDB = require("../config/db.config");

async function updateUserCredits(req, res) {
    try {
        await connectDB();
        const { email, credits } = req.body;
        if (!email || typeof credits !== "number") {
            return res.status(400).json({ error: "Missing or invalid params" });
        }
        const result = await User.findOneAndUpdate(
            { email },
            { credits },
            { new: true }
        );
        return res.json({ success: true, result });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

async function getUserDetail(req, res) {
    await connectDB();
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Missing email" });
    }
    const user = await User.findOne({ email });
    return res.json(user || null);
}

module.exports = {
    updateUserCredits,
    getUserDetail
};
