const path = require('path');
const fs = require('fs').promises;
const ffmpeg = require('fluent-ffmpeg');
const {
    v4: uuidv4
} = require('uuid');
const { 
    ref, 
    getDownloadURL,
    uploadBytes 
} = require('firebase/storage');

const { 
    storage 
} = require('../config/FirebaseConfigs.config');
const {
    transcribe
} = require('../helpers/ai-services.h');
const {
    insertVideo,
    getVideos,
    getPublicVideos,
    setPublicVideo,
    deleteVideo,
    updateURL
} = require('../repositories/videos');
const {
    insertCreatedVideo,
    getCreatedVideos,
    getFavoriteVideos,
    insertFavoriteVideo,
    removeFavoriteVideo
} = require('../repositories/users');

const EXTENSIONS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/aac': '.aac',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'font/ttf': '.ttf',
};

const FADE_DURATION_IN_SECONDS = 1;
const TEMP_DIR = '../temp';

function createFilePath(ext) {
    return path.join(__dirname, TEMP_DIR, `${uuidv4()}${ext}`);
}

async function download(source) {
    const response = await fetch(source);

    if (!response.ok || !response.body) {
        throw new Error(`Failed to download ${source} - status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    const dest = createFilePath(EXTENSIONS[contentType]);

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(dest, buffer);

    return dest;
}

async function remove(files) {
    const tasks = files.map(file => fs.unlink(file));
    await Promise.all(tasks);
}

async function getDuration(file) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(file, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration);
        });
    });
}

async function createVideos({ 
    width: width,
    height: height,
    scenes: scenes 
}) {
    let promises = [];
    let tempfiles = [];

    for (const scene of scenes) {
        let filepath = createFilePath('.mp4');
        let image = await download(scene.image);
        let audio = await download(scene.audio);
        let duration = await getDuration(audio);

        let promise = new Promise((resolve, reject) => {
            ffmpeg()
                .input(image)
                .inputOptions([
                    '-loop 1'
                ])
                .size(`${width}x${height}`)
                .input(audio)
                .videoFilters('format=yuv420p')
                .outputOptions([
                    `-t ${duration + FADE_DURATION_IN_SECONDS}`,
                    '-map 0:v',
                    '-map 1:a',
                    '-c:a mp3',
                    '-c:v libx264',
                ])
                .output(filepath)
                .on('end', () => resolve({ 
                    path: filepath, 
                    duration: duration + FADE_DURATION_IN_SECONDS 
                }))
                .on('error', (err) => reject(err))
                .run();
        });

        promises.push(promise);
        tempfiles.push(image, audio);
    }

    let videos = await Promise.all(promises);
    remove(tempfiles);
    return videos;
}

async function concatVideos({
    videos: videos, 
    transition: transition = 'smoothleft' 
}) {
    const outputFile = createFilePath('.mp4');
    const command = ffmpeg();

    for (const video of videos) {
        command.input(video.path);
    }

    const filters = [];
    let lastVideo = '0:v';
    let lastOffset = videos[0].duration - FADE_DURATION_IN_SECONDS;

    for (let i = 1; i < videos.length; i++) {
        const curVideo = `${i}:v`;
        const outVideo = `v${i}`;

        filters.push({
            filter: 'xfade',
            options: {
                transition: transition,
                duration: FADE_DURATION_IN_SECONDS,
                offset: lastOffset
            },
            inputs: [lastVideo, curVideo],
            outputs: outVideo
        });

        lastVideo = outVideo;
        lastOffset += videos[i].duration - FADE_DURATION_IN_SECONDS;
    }

    filters.push({
        filter: 'concat',
        options: {
            n: videos.length,
            v: 0,
            a: 1
        },
        inputs: videos.map((_, i) => `${i}:a`),
        outputs: 'aout'
    });

    const result = await new Promise((resolve, reject) => {
        command
            .complexFilter(filters)
            .outputOptions([
                `-map [${lastVideo}]`,
                `-map [aout]`,
                '-c:a mp3',
                '-shortest'
            ])
            .output(outputFile)
            .on('end', () => resolve(outputFile))
            .on('error', reject)
            .run();
    });

    remove(videos.map(video => video.path));
    return result;
}

function convertSecondsToTimestamp(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);

    const pad = (num, size) => String(num).padStart(size, '0');

    return `${pad(hrs, 2)}:${pad(mins, 2)}:${pad(secs, 2)},${pad(millis, 3)}`;
}

async function createTranscription(video) {
    const duration = await getDuration(video);
    const audioFile = createFilePath('.mp3');
    await new Promise((resolve, reject) => {
        ffmpeg(video)
            .outputOptions([
                `-t ${duration}`,
                '-map 0:a',
                '-c:a mp3'
            ])
            .output(audioFile)
            .on('end', () => resolve())
            .on('error', (err) => {
                console.error('Error extracting audio:', err);
                reject(err);
            })
            .run();
    });

    const segments = await transcribe(audioFile);
    await fs.unlink(audioFile);

    const transcriptionFile = createFilePath('.srt');
    let subtitleContent = '';
    
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const start = convertSecondsToTimestamp(segment.start);
        const end = convertSecondsToTimestamp(segment.end);
        subtitleContent += `${i + 1}\n${start} --> ${end}\n${segment.text}\n\n`;
    }
    
    await fs.writeFile(transcriptionFile, subtitleContent);
    return transcriptionFile;
}

async function addSubtitles(video) {
    let subtitleFile = await createTranscription(video);

    const outputFile = createFilePath('.mp4');
    await new Promise((resolve, reject) => {
        ffmpeg()
            .input(video)
            .videoFilters(`subtitles='${subtitleFile.replace(/\\/g, '\\\\').replace(/:/g, '\\:')}'`)
            .outputOptions([
                '-c:v libx264',
                '-c:a mp3',
            ])
            .output(outputFile)
            .on('end', () => resolve(outputFile))
            .on('error', (err) => {
                console.error('Error adding subtitles:', err);
                reject(err);
            })
            .run();
    });   

    await remove([video, subtitleFile]);
    return outputFile;
}

async function uploadToFirebase(filePath) {
    const fileRef = ref(storage, `ai-short-video-files/${path.basename(filePath)}`);

    const fileBuffer = await fs.readFile(filePath);
    await uploadBytes(fileRef, fileBuffer, { contentType: 'video/mp4' });
    const url = await getDownloadURL(fileRef);

    await fs.unlink(filePath);
    return url;
}

async function createVideoController(req, res, next) {
    try {
        const { scenes, width, height, transition } = req.body;

        const videos = await createVideos({
            width: width,
            height: height,
            scenes: scenes
        });

        const mergedVideo = await concatVideos({
            videos: videos,
            transition: transition
        });

        const finalVideo = await addSubtitles(mergedVideo);

        req.body.url = await uploadToFirebase(finalVideo);

        next();
    } catch (err) {
        console.error('Error creating video:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function insertVideoController(req, res) {
    try {
        const { scenes, url, width, height } = req.body;
        const video = await insertVideo({
            url: url,
            width: width,
            height: height,
            scenes: scenes
        });
        await insertCreatedVideo(req.user.id, video._id);
        return res.status(201).json(video);
    }
    catch (error) {
        console.error('Error inserting video:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getCreatedVideosController(req, res) {
    try {
        const videoIDs = await getCreatedVideos(req.user.id); 
        const videos = await getVideos(videoIDs);
        return res.status(200).json({
            data: videos
        });
    }
    catch (err) {
        console.error('Error retrieving videos:', err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function getFavoriteVideosController(req, res) {
    try {
        const videoIDs = await getFavoriteVideos(req.user.id);  
        const videos = await getVideos(videoIDs);
        return res.status(200).json({
            data: videos
        });
    }
    catch (err) {
        console.error('Error retrieving favorite videos:', err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function getPublicVideosController(req, res) {
    try {
        const videos = await getPublicVideos();
        return res.status(200).json({
            data: videos
        });
    }
    catch (err) {
        console.error('Error retrieving public videos:', err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function setPublicVideoController(req, res) {
    try {
        const { id, is_public } = req.body;
        const result = await setPublicVideo(id, is_public);
        return res.status(200).json({
            message: 'Updated video visibility successfully'
        });
    } catch (error) {
        console.error('Error updating video visibility:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deleteVideoController(req, res) {
    try {
        const videoId = req.params.id;
        const result = await deleteVideo(videoId);
        return res.status(200).json({
            message: 'Video deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting video:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function addEffects(video, options) {
    const outputFile = createFilePath('.mp4');
    
    const videoFile = await download(video);
    const videoDuration = await getDuration(videoFile);
    
    const command = ffmpeg().input(videoFile);
    const filters = [];
    const tempfiles = [videoFile];

    let index = 1;

    let { music, stickers, texts } = options;

    if (music) {
        const musicFile = await download(music.url);
        const musicDuration = await getDuration(musicFile);
        const musicLoopCount = Math.ceil(videoDuration / musicDuration);
        tempfiles.push(musicFile);
        index++;

        command
            .input(musicFile)
            .inputOptions(['-stream_loop', musicLoopCount.toString()]);

        filters.push({
            filter: 'volume',
            options: music.volume.toString(),
            inputs: '1:a',
            outputs: 'music_out'
        });

        filters.push({
            filter: 'amix',
            options: {
                inputs: 2,
                duration: 'first',
                dropout_transition: 0.5
            },
            inputs: ['0:a', 'music_out'],
            outputs: 'final_audio'
        });
    }

    let lastOverlay = '0:v';

    if (stickers && stickers.length > 0) {
        stickers = await Promise.all(stickers.map(async (sticker) => {
            const stickerFile = await download(sticker.url);
            tempfiles.push(stickerFile);
            return {
                ...sticker,
                file: stickerFile
            }
        }));

        for (const sticker of stickers) {
            command.input(sticker.file);

            filters.push({
                filter: 'scale',
                options: `${sticker.width}:${sticker.height}`,
                inputs: `${index}:v`,
                outputs: `scaledSticker${index}`
            });

            filters.push({
                filter: 'overlay',
                options: {
                    x: sticker.x,
                    y: sticker.y,
                    enable: `between(t,${sticker.start},${sticker.end})`
                },
                inputs: [lastOverlay, `scaledSticker${index}`],
                outputs: `overlay${index}`
            });

            lastOverlay = `overlay${index}`;
            index++;
        }
    }

    if (texts && texts.length > 0) {
        texts = await Promise.all(texts.map(async (text) => {
            const fontFile = await download(text.font);
            tempfiles.push(fontFile);
            return {
                ...text,
                fontFile: fontFile
            };
        }));

        for (const text of texts) {
            filters.push({
                filter: 'drawtext',
                options: {
                    text: text.content,
                    fontfile: text.fontFile.replace(/\\/g, '\/').replace(/:/g, '\\\\:'),
                    fontsize: text.size,
                    fontcolor: text.color,
                    x: text.x,
                    y: text.y,
                    enable: `between(t,${text.start},${text.end})`
                },
                inputs: lastOverlay,
                outputs: `overlay${index}`
            });
            lastOverlay = `overlay${index}`;
            index++;
        }
    }

    const promise = new Promise((resolve, reject) => {
        command
            .complexFilter(filters)
            .outputOptions([
                `-map ${lastOverlay === '0:v' ? '0:v' : `[${lastOverlay}]`}`,
                `-map ${music ? '[final_audio]' : '0:a'}`,
                '-c:v libx264',
                '-c:a mp3'
            ])
            .output(outputFile)
            .on('end', () => resolve(outputFile))
            .on('error', (err) => { reject(err) })
            .run();
    });

    const finalVideo = await promise;
    remove(tempfiles);
    return finalVideo;
}

async function editVideoController(req, res) {
    try {
        const { options } = req.body;
        const videoId = req.params.id;
        const video = (await getVideos([videoId]))[0];
        const videoFile = await addEffects(video.url, options);

        const url = await uploadToFirebase(videoFile);

        const updatedVideo = await updateURL(videoId, url);

        return res.status(200).json({
            data: {
                id: updatedVideo.id,
                url: updatedVideo.url
            }
        });
    }
    catch (error) {
        console.error('Error editing video:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function insertFavoriteVideoController(req, res) {
    try {
        const userId = req.user.id;
        const videoId = req.params.id;
        if (!userId || !videoId) {
            return res.status(400).json({ error: "Missing userId or videoId" });
        }
        const result = await insertFavoriteVideo(userId, videoId);
        return res.status(200).json({
            message: 'Added video to favorites successfully'
        });
    }
    catch (error) {
        console.error('Error adding favorite video:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function removeFavoriteVideoController(req, res) {
    try {
        const userId = req.user.id;
        const videoId = req.params.id;
        if (!userId || !videoId) {
            return res.status(400).json({ error: "Missing userId or videoId" });
        }
        const result = await removeFavoriteVideo(userId, videoId, false);
        return res.status(200).json({
            message: 'Removed video from favorites successfully'
        });
    }
    catch (error) {
        console.error('Error removing favorite video:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    insertVideoController,
    createVideoController,
    getCreatedVideosController,
    getFavoriteVideosController,
    getPublicVideosController,
    setPublicVideoController,
    deleteVideoController,
    editVideoController,
    insertFavoriteVideoController,
    removeFavoriteVideoController
};