const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./config/passport.config');
const corsOptions = require('./config/cors.config'); 
const connectDB = require('./config/db.config');
const inngestHandler = require('./config/inngest.config');

const app = express();

app.use(passport.initialize());
require('dotenv').config();

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routers/auth.r'));
app.use('/inngest/server', inngestHandler);
app.use('/api/inngest', require('./routers/inngest.r'));

app.use(require('./middlewares/verify.mw'));
app.use('/api/voices', require('./routers/voices.r'));
app.use('/api/topics', require('./routers/topics.r'));
app.use('/api/users', require('./routers/users.r'));
app.use('/api/video', require('./routers/video.r'));
app.use('/api/audio', require('./routers/audio.r'));
app.use('/api/youtube', require('./routers/youtube.r'));

app.use('/routers/video', require('./routers/video.r'));
app.use('/routers/users', require('./routers/users.r'));
app.use('/routers/audio', require('./routers/audio.r'));
app.use('/routers/users', require('./routers/users.r'));

const PORT = process.env.SERVER_PORT || 3000;

const fetch = require('node-fetch');

const testRenderPromoVideo = async () => {
    const body = {
        videoId: 'test-video-id',
        videoData: { foo: 'bar' }
    };
    try {
        const res = await fetch('http://localhost:5000/api/inngest/render-promo-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log('Test render-promo-video:', data);
    } catch (err) {
        console.error('Test render-promo-video error:', err);
    }
};

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        testRenderPromoVideo();
        // testSaveLinkVideo(); 
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});