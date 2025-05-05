const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/cors.config');
require('dotenv').config();
const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});