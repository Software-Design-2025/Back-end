const { inngest } = require('./client');
const { getServices, renderMediaOnCloudrun } = require('@remotion/cloudrun/client');
const axios = require('axios');

const RenderCloudVideo = inngest.createFunction(
    { id: 'render-video' },
    { event: 'render/promo-video' },
    async ({ event, step }) => {
        const { videoId, videoData } = event.data;

        const serveUrl = process.env.REMOTION_GCP_SERVE_URL;
        const composition = process.env.REMOTION_GCP_COMPOSITION || 'Empty';

        function groupCaptionsByWords(captions, groupSize = 10) {
            if (!Array.isArray(captions) || captions.length === 0) return [];
            const grouped = [];
            let current = [];
            let start = null;
            let end = null;
            for (let i = 0; i < captions.length; i++) {
                const word = captions[i];
                if (current.length === 0) start = word.start;
                current.push(word.text);
                end = word.end;
                if (current.length === groupSize || i === captions.length - 1) {
                    grouped.push({
                        text: current.join(' '),
                        start,
                        end,
                    });
                    current = [];
                }
            }
            return grouped;
        }

        let processedCaptions = groupCaptionsByWords(videoData?.captions, 15);

        let durationInFrames = 60;
        let fps = 30;
        if (processedCaptions.length > 0) {
            let lastEnd = processedCaptions[processedCaptions.length - 1]?.end;
            if (lastEnd < 1000) {
                lastEnd = lastEnd * 1000;
            }
            durationInFrames = Math.round((lastEnd / 1000) * fps);
        }

        const width = videoData?.width ?? 600;
        const height = videoData?.height ?? 340;

        const inputProps = {
            script: videoData?.script || '',
            audioFileUrl:
                videoData?.audioFileUrl?.includes('/api/proxy-audio')
                    ? decodeURIComponent(videoData.audioFileUrl.split('url=')[1] || '')
                    : videoData?.audioFileUrl || '',
            captions: processedCaptions,
            imageList: videoData?.imageList || [],
            fontSize: videoData?.fontSize ?? 32,
            fontFamily: videoData?.fontFamily ?? 'Bungee',
            color: videoData?.color ?? '#fff',
            animationType: videoData?.animationType ?? 'fade',
            bgAnimationType: videoData?.bgAnimationType ?? 'fade',
            musicFile: videoData?.musicFile ?? null,
            sticker: videoData?.sticker ?? null,
            stickerWidth: videoData?.stickerWidth ?? 64,
            stickerHeight: videoData?.stickerHeight ?? 64,
            durationInFrames,
            width,
            height,
        };

        if (inputProps.musicFile) {
            let musicName = inputProps.musicFile;
            if (
                typeof musicName === "string" &&
                (musicName.startsWith("http://") || musicName.startsWith("https://"))
            ) {
                try {
                    new URL(musicName);
                } catch {
                    inputProps.musicFile = null;
                }
            } else {
                if (!musicName.toLowerCase().endsWith(".mp3")) {
                    musicName = musicName + ".mp3";
                }
                const nameMap = {
                    "happy.mp3": "Happy.mp3",
                    "piano.mp3": "Piano.mp3",
                    "violin.mp3": "Violin.mp3"
                };
                musicName = nameMap[musicName.toLowerCase()] || musicName;
                try {
                    const res = await fetch(
                        `${process.env.INTERNAL_API_ORIGIN || "http://localhost:3000"}/api/get-audio-link?name=${encodeURIComponent(musicName)}`
                    );
                    if (res.ok) {
                        const data = await res.json();
                        try {
                            new URL(data?.url);
                            inputProps.musicFile = data?.url;
                        } catch {
                            inputProps.musicFile = null;
                        }
                    } else {
                        inputProps.musicFile = null;
                    }
                } catch {
                    inputProps.musicFile = null;
                }
            }
        }

        // Bước render
        const renderResult = await step.run('Render video on CloudRun', async () => {
            try {
                const services = await getServices({
                    region: 'us-east1',
                    compatibleOnly: true,
                });

                const serviceName = services[0]?.serviceName;
                if (!serviceName) {
                    throw new Error('No compatible Cloud Run service found.');
                }

                if (inputProps.audioFileUrl.includes('/proxy-audio')) {
                    throw new Error('audioFileUrl still contains proxy-audio!');
                }

                const result = await renderMediaOnCloudrun({
                    serviceName,
                    region: 'us-east1',
                    serveUrl,
                    composition,
                    inputProps,
                    codec: 'h264',
                    durationInFrames,
                    fps,
                    width,
                    height,
                });

                if (result?.type === 'success') {
                    await axios.post(
                        `${process.env.INTERNAL_API_ORIGIN || "http://localhost:3000"}/api/save-link-video`,
                        {
                            videoId,
                            videoOutputUrl: result.publicUrl
                        })
                    return {
                        success: true,
                        publicUrl: result.publicUrl,
                        renderId: result.renderId,
                        bucketName: result.bucketName,
                        cloudStorageUri: result.cloudStorageUri,
                        size: result.size,
                        privacy: result.privacy,
                    };
                }

                const errorMsg = result?.message || result?.error || 'Unknown error';
                console.error('Render error:', errorMsg);
                return { success: false, error: errorMsg };
            } catch (err) {
                console.error('Exception during rendering:', err);
                return {
                    success: false,
                    error: err?.message || 'Service crashed',
                    details: err?.response?.data || null,
                };
            }
        });

        if (!renderResult) {
            console.error('Render step returned undefined (service may have crashed or timed out)');
            return {
                data: null,
                error: 'Render step returned undefined (service may have crashed or timed out)',
            };
        }

        try {
            if (typeof renderResult !== 'object') {
                return { data: null, error: 'Invalid response from render step', raw: renderResult };
            }

            if (!renderResult.success) {
                return {
                    data: null,
                    error: renderResult.error || 'Unknown rendering failure',
                    details: renderResult.details || null,
                };
            }

            const { publicUrl, renderId, bucketName, cloudStorageUri, size, privacy } = renderResult;

            return {
                data: {
                    publicUrl: publicUrl || null,
                    renderId: renderId || null,
                    bucketName: bucketName || null,
                    cloudStorageUri: cloudStorageUri || null,
                    size: size || null,
                    privacy: privacy || null,
                },
            };
        } catch (e) {
            console.error('Serialization failed:', renderResult, e);
            return {
                data: null,
                error: 'Failed to serialize output',
                raw: String(renderResult),
            };
        }
    }
);

module.exports = {
    RenderCloudVideo
};
