const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const URI = process.env.DB_URI;
const client = new MongoClient(URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const DATABASE = process.env.DB_NAME;
module.exports = async () => {
    try {
        await client.connect();
        let db = client.db(DATABASE);
        return db;
    } catch (error) {
        throw error;
    }
}
