const connectDB = require("../config/db.config");

module.exports = {
    find: async (page = 1, per_page = 5) => {
        const db = await connectDB();
        const collection = db.collection("voices");
        const [voices, total] = await Promise.all([
            collection
                .find({})
                .skip((page - 1) * per_page)
                .limit(per_page)
                .toArray(),
            collection.countDocuments()
        ]);
        return {
            page: page,
            total_pages: Math.ceil(total / per_page),
            per_page: per_page,
            voices: voices
        };
    }
}