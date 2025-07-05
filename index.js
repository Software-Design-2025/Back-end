const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./config/passport.config');
const corsOptions = require('./config/cors.config');
const connectDB = require('./config/db.config');

const app = express();

app.use(passport.initialize());
require('dotenv').config();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routers/auth.router'));

app.use(require('./middlewares/verify.mw'));
app.use('/api/voices', require('./routers/voices.router'));
app.use('/api/topics', require('./routers/topics.router'));
app.use('/api/users', require('./routers/users.router'));
app.use('/api/youtube', require('./routers/youtube.router'));
app.use('/api/assets', require('./routers/assets.router'));
app.use('/api/videos', require('./routers/videos.router'));
app.use('/api/images', require('./routers/images.router'));
app.use('/api/scripts', require('./routers/scripts.router'));

const PORT = process.env.SERVER_PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
