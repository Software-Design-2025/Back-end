const connectDB = require("../config/db.config");
const { ObjectId } = require("mongodb");

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
    },

    updateOne: async (id, info) => {
        const db = await connectDB();
        const collection = db.collection("users");
        const result = await collection.updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: info }
        );
        return result.modifiedCount > 0;
    }
}