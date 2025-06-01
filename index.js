const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/cors.config');
const passport = require('passport');
require('dotenv').config();
require('./config/passport.config');

app.use(passport.initialize());
require('dotenv').config();

const corsOptions = require('./config/cors.config');
const app = express();

// Middleware
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
app.use('/routers/add-favorite-video', require('./routers/add-favorite-video.r'));
app.use('/routers/remove-favorite-video', require('./routers/remove-favorite-video.r'));
app.use('/routers/get-favorite-videos', require('./routers/get-favorite-videos.r'));
app.use('/routers/get-video-public', require('./routers/get-video-public.r'));
app.use('/routers/public-video', require('./routers/public-video.r'));
app.use('/routers/save-video-edit', require('./routers/save-video-edit.r'));
app.use('/routers/save-audio-file', require('./routers/save-audio-file.r'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    const fetch = require('node-fetch');

    const testEmail = 'phongvan2032004@gmail.com';
    // fetch(`http://localhost:${PORT}/routers/get-user-detail?email=${encodeURIComponent(testEmail)}`)
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log('Test get-user-detail:', data);
    //     })
    //     .catch(err => {
    //         console.error('Test get-user-detail error:', err);
    //     });


    // fetch(`http://localhost:${PORT}/routers/generate-video-script`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ prompt: 'write a script to generate 30 seconds video on topic: Historycal story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field' })
    // })
    //     .then(async res => {
    //         const contentType = res.headers.get('content-type');
    //         if (contentType && contentType.includes('application/json')) {
    //             const data = await res.json();
    //             console.log('Test get-video-script:', data);
    //         } else {
    //             const text = await res.text();
    //             console.error('Test get-video-script error: Not JSON, response text:', text);
    //         }
    //     })
    //     .catch(err => {
    //         console.error('Test get-video-script error:', err);
    //     });


    // fetch(`http://localhost:${PORT}/routers/add-favorite-video`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ userEmail: testEmail, videoId: '683045d5c6ffb4d2be16a9b1' }) 
    // })
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log('Test add-favorite-video:', data);

    //         // fetch(`http://localhost:${PORT}/routers/get-favorite-videos?userEmail=${encodeURIComponent(testEmail)}`, {
    //         //     method: 'GET',
    //         //     headers: { 'Content-Type': 'application/json' }
    //         // })
    //         //     .then(res => res.json())
    //         //     .then(data => {
    //         //         console.log('Test get-favorite-videos:', data);
    //         //     })
    //         //     .catch(err => {
    //         //         console.error('Test get-favorite-videos error:', err);
    //         //     });

    //         // fetch(`http://localhost:${PORT}/routers/get-video-public`, {
    //         //     method: 'GET',
    //         //     headers: { 'Content-Type': 'application/json' }
    //         // })
    //         //     .then(res => res.json())
    //         //     .then(data => {
    //         //         console.log('Test get-video-public:', data);
    //         //     })
    //         //     .catch(err => {
    //         //         console.error('Test get-video-public error:', err);
    //         //     });

    //         fetch(`http://localhost:${PORT}/routers/public-video`, {
    //             method: 'PATCH',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ videoId: '683045d5c6ffb4d2be16a9b1', public: false })
    //         })
    //             .then(res => res.json())
    //             .then(data => {
    //                 console.log('Test public-video:', data);
    //             })
    //             .catch(err => {
    //                 console.error('Test public-video error:', err);
    //             });
    //     })
    //     .catch(err => {
    //         console.error('Test add-favorite-video error:', err);
    //     });

    // Test save-video-edit
    fetch(`http://localhost:${PORT}/routers/save-video-edit/api/save-video-edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            videoId: '683045d5c6ffb4d2be16a9b1',
            fontFamily: 'Arial',
            fontSize: 18,
            textColor: '#000000',
            textAnimation: 'fadeIn',
            bgAnimation: 'slideUp',
            sticker: 'star',
            stickerWidth: 100,
            stickerHeight: 100,
            audioUrl: 'https://example.com/audio.mp3',
            screenSize: '1920x1080'
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log('Test save-video-edit:', data);
        })
        .catch(err => {
            console.error('Test save-video-edit error:', err);
        });
});
