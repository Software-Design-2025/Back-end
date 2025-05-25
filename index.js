const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const corsOptions = require('./config/cors.config');
const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/routers/save-video-data', require('./routers/save-video-data.r'));
app.use('/routers/get-video-data', require('./routers/get-video-data.r'));
app.use('/routers/generate-audio', require('./routers/generate-audio.r'));
app.use('/routers/generate-caption', require('./routers/generate-caption.r'));
app.use('/routers/generate-image', require('./routers/generate-image.r'));
app.use('/routers/get-user-detail', require('./routers/get-user-detail.r'));
app.use('/routers/update-user-credits', require('./routers/update-user-credits.r'));
app.use('/routers/get-video-script', require('./routers/get-video-script.r'));
app.use('/routers/proxy-audio', require('./routers/proxy-audio.r'));
app.use('/routers/get-video-createdBy', require('./routers/get-video-createdBy.r'));


const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    const fetch = require('node-fetch');
    const testEmail = 'user@example.com'; 
    fetch(`http://localhost:${PORT}/routers/get-user-detail?email=${encodeURIComponent(testEmail)}`)
        .then(res => res.json())
        .then(data => {
            console.log('Test get-user-detail:', data);
        })
        .catch(err => {
            console.error('Test get-user-detail error:', err);
        });
});
