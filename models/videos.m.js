const connectDB = require("../config/db.config");
const { ObjectId } = require("mongodb");

module.exports = {
    findOne: async (id) => {
        const db = await connectDB();
        const collection = db.collection("videos");
        const video = await collection.aggregate([
            { $match: { _id: ObjectId.createFromHexString(id) }} ,
            { $lookup: {
                from: 'users',
                localField: 'created_by',
                foreignField: '_id',
                as: 'owner'
            }},
            { $unwind: { 
                path: "$owner", 
                preserveNullAndEmptyArrays: true 
            }},
            { $project: {
                _id: 1, 
                url: 1, 
                created_at: 1, 
                favorites: 1, 
                'owner._id': 1, 
                'owner.fullname': 1,
                'owner.avatar': 1
            }},
        ]).toArray();
        return video[0];
    }
}