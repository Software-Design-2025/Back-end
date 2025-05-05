const Users = require('../models/users.m');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    register: async (req, res) => {
        try {
            const { fullname, username, email, password } = req.body;

            const existingUsername = await Users.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const existingEmail = await Users.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = await Users.insertOne({
                fullname, 
                username,
                email,
                password: hashedPassword
            });

            res.status(201).json({ 
                message: 'New user created',
                user: newUser
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}