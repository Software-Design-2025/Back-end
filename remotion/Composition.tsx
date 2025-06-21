import React, { useEffect } from 'react';
import { AbsoluteFill, Audio, Img, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { interpolate } from 'remotion';
import * as Bungee from '@remotion/google-fonts/Bungee';
import * as Anton from '@remotion/google-fonts/Anton';
import * as Parisienne from '@remotion/google-fonts/Parisienne';
import * as Pacifico from '@remotion/google-fonts/Pacifico';
import Animation, { getRemotionAnimationStyle } from '../_data/Animation';

type Caption = {
    start: number;
    end: number;
    text: string;
};

interface RemotionCompositionProps {
    durationInFrames?: number;
    script?: string;
    audioFileUrl?: string;
    captions?: Caption[];
    imageList?: string[];
    setDurationFrame?: ((duration: number) => void) | null;
    fontSize?: number;
    fontFamily?: string | { name: string };
    color?: string;
    animationType?: string;
    bgAnimationType?: string;
    musicFile?: string | null;
    sticker?: string | null;
    stickerWidth?: number;
    stickerHeight?: number;
}

function RemotionComposition({
    durationInFrames = 60,
    script = "",
    audioFileUrl = "",
    captions = [],
    imageList = [],
    setDurationFrame = null,
    fontSize = 32,
    fontFamily = "Bungee",
    color = "#fff",
    animationType = "fade",
    bgAnimationType = "fade",
    musicFile = null,
    sticker = null,
    stickerWidth = 64,
    stickerHeight = 64,
}: RemotionCompositionProps) {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    React.useEffect(() => {
        if (fontFamily === "Bungee") Bungee.loadFont();
        if (fontFamily === "Anton") Anton.loadFont();
        if (fontFamily === "Parisienne") Parisienne.loadFont();
        if (fontFamily === "Pacifico") Pacifico.loadFont();
    }, [fontFamily]);

    useEffect(() => {
        if (setDurationFrame && captions.length > 0) {
            const duration = (captions[captions.length - 1]?.end / 1000) * fps;
            setDurationFrame(duration);
        }
    }, [captions, fps, setDurationFrame]);

    const getDurationFrame = () => {
        return captions[captions.length - 1]?.end / 1000 * fps || 60;
    };

    const getCurrentCaptions = () => {
        const currentTime = frame / 30 * 1000;
        const currentCaption = captions.find((word) => currentTime >= word.start && currentTime <= word.end);
        return currentCaption ? currentCaption?.text : "";
    }

    const resolvedFontFamily = typeof fontFamily === "object" ? fontFamily.name : fontFamily;

    const imgAnimationDuration = 1200;
    const textAnimationDuration = 500;

    const getMusicUrl = (musicName: string | null | undefined): string | undefined => {
        if (!musicName) return undefined;
        return `/${musicName.toLowerCase().replace(/\s+/g, '')}.mp3`;
    };

    return (
        <AbsoluteFill className='bg-black'>
            {imageList?.map((item, index) => {
                const startTime = index * getDurationFrame() / imageList.length;
                const duration = getDurationFrame();

                const localFrame = Math.max(0, frame - startTime);

                const scaleValue = interpolate(
                    localFrame,
                    [0, duration / 2, duration],
                    index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                const imgStyle = getRemotionAnimationStyle({
                    type: bgAnimationType,
                    localFrame,
                    durationMs: imgAnimationDuration,
                    fps,
                    scaleValue
                });

                return (
                    <Sequence
                        key={index}
                        from={startTime}
                        durationInFrames={getDurationFrame()}
                    >
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Img
                                src={item}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    ...imgStyle
                                }}
                            />
                            <AbsoluteFill style={{
                                color: color,
                                justifyContent: 'center',
                                top: undefined, bottom: 50, height: 150, textAlign: 'center', width: '100%'
                            }}>
                                {/* Hiển thị sticker trước caption nếu có */}
                                {sticker && (
                                    typeof sticker === "string" && (
                                        sticker.startsWith("http") || sticker.startsWith("/")
                                            ? <img src={sticker} alt="sticker" style={{ width: stickerWidth, height: stickerHeight, marginBottom: 2, display: "inline-block" }} />
                                            : <span style={{ fontSize: Math.max(stickerWidth, stickerHeight), marginBottom: 2, display: "inline-block", verticalAlign: "middle" }}>{sticker}</span>
                                    )
                                )}
                                {/* Animation cho caption/text vẫn giữ nguyên */}
                                <Animation
                                    type={animationType}
                                    duration={textAnimationDuration}
                                >
                                    <h2
                                        className='text-2xl'
                                        style={{ fontSize, fontFamily: resolvedFontFamily }}
                                    >
                                        {getCurrentCaptions()}
                                    </h2>
                                </Animation>
                            </AbsoluteFill>
                        </AbsoluteFill>
                    </Sequence>
                )
            })}

            {audioFileUrl && (
                <Audio
                    src={audioFileUrl}
                    startFrom={0}
                    volume={1}
                />
            )}

            {musicFile && (
                <Audio
                    src={musicFile.startsWith("http") ? musicFile : getMusicUrl(musicFile) ?? undefined}
                    startFrom={0}
                    volume={0.5}
                />
            )}

        </AbsoluteFill>
    );
}

export default RemotionComposition;