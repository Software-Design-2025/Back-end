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
    getVideos
} = require('../repositories/videos');
const {
    insertCreatedVideo,
    getCreatedVideos
} = require('../repositories/users');

const EXTENSIONS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/aac': '.aac',
    'video/mp4': '.mp4',
    'video/webm': '.webm'
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
        const { scenes, url } = req.body;
        const video = await insertVideo({
            url: url,
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
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}

module.exports = {
    insertVideoController,
    createVideoController,
    getCreatedVideosController
};