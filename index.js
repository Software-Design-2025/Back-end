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
app.use('/routers/generate-video-script', require('./routers/generate-video-script.r'));
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


    fetch(`http://localhost:${PORT}/routers/generate-video-script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'write a script to generate 30 seconds video on topic: Historycal story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field' })
    })
        .then(async res => {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                console.log('Test get-video-script:', data);
            } else {
                const text = await res.text();
                console.error('Test get-video-script error: Not JSON, response text:', text);
            }
        })
        .catch(err => {
            console.error('Test get-video-script error:', err);
        });
});
