const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-short-video-generator-56c7e.firebaseapp.com",
  projectId: "ai-short-video-generator-56c7e",
  storageBucket: "ai-short-video-generator-56c7e.firebasestorage.app",
  messagingSenderId: "235074957515",
  appId: "1:235074957515:web:18546ddfe3cfec1605eb4e",
  measurementId: "G-SEPE043PK3"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };