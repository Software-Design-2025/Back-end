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
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
