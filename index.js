const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/cors.config');
const passport = require('passport');
require('dotenv').config();
require('./config/passport.config');
const app = express();

app.use(passport.initialize());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routers/auth.r'));
app.use('/api/voices', require('./routers/voices.r'));
app.use('/api/topics', require('./routers/topics.r'));
app.use('/api/videos', require('./routers/videos.r'));
app.use('/api/users', require('./routers/users.r'));

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});