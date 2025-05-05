const connectDB = require("../config/db.config");

module.exports = {
    findOne: async (query) => {
        const db = await connectDB();
        const collection = db.collection("users");
        const user = await collection.findOne(query);
        return user;
    },

    insertOne: async (user) => {
        const db = await connectDB();
        const collection = db.collection("users");
        const result = await collection.insertOne(user);
        return {
            id: result.insertedId,
            fullname: user.fullname,
            username: user.username,
            email: user.email
        }
    }
}