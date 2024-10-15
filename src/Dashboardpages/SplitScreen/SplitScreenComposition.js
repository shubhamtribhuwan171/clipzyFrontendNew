import React from 'react';
import { AbsoluteFill, Img, Video, useVideoConfig, Audio, interpolate, useCurrentFrame, spring } from 'remotion';

const SplitScreenComposition = ({
    topMedia,
    bottomMedia,
    topMediaType,
    bottomMediaType,
    backgroundMusic,
    volume,
    transition,
    voiceOver,
    topMediaPosition,
    bottomMediaPosition,
    topMediaScale,
    bottomMediaScale,
    topMediaVerticalPosition,
    bottomMediaVerticalPosition,
    topMediaFit,
    bottomMediaFit
}) => {
    const { width, height, durationInFrames, fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const renderMedia = (media, mediaType, position, scale, verticalPosition, mediaFit) => {
        if (!media) {
            return (
                <AbsoluteFill style={{ backgroundColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ color: 'white', fontSize: '24px' }}>No media uploaded</p>
                </AbsoluteFill>
            );
        }

        let style = {
            width: '100%',
            height: '100%',
            objectFit: mediaFit === 'fill' ? 'cover' : 'contain',
        };

        if (mediaFit === 'custom') {
            style = {
                ...style,
                objectFit: 'none',
                transform: `translate(${position.x}px, ${position.y + verticalPosition}px) scale(${scale})`,
            };
        }

        if (mediaType === 'video') {
            return (
                <>
                    <Video src={media} style={style} />
                    <Audio src={media} volume={volume} />
                </>
            );
        } else {
            return <Img src={media} style={style} />;
        }
    };

    const applyTransition = (children) => {
        const progress = interpolate(frame, [0, durationInFrames], [0, 1]);

        switch (transition) {
            case 'fade':
                return <div style={{ opacity: progress }}>{children}</div>;

            case 'slideHorizontal':
                const slideX = interpolate(progress, [0, 1], [-width, 0]);
                return <div style={{ transform: `translateX(${slideX}px)` }}>{children}</div>;

            case 'slideVertical':
                const slideY = interpolate(progress, [0, 1], [-height, 0]);
                return <div style={{ transform: `translateY(${slideY}px)` }}>{children}</div>;

            case 'zoom':
                const scale = interpolate(progress, [0, 1], [0.5, 1]);
                return <div style={{ transform: `scale(${scale})` }}>{children}</div>;

            case 'rotate':
                const rotation = interpolate(progress, [0, 1], [0, 360]);
                return <div style={{ transform: `rotate(${rotation}deg)` }}>{children}</div>;

            default:
                return children;
        }
    };

    return (
        <AbsoluteFill>
            {applyTransition(
                <>
                    <AbsoluteFill style={{ top: 0, height: '50%' }}>
                        {renderMedia(topMedia, topMediaType, topMediaPosition, topMediaScale, topMediaVerticalPosition, topMediaFit)}
                    </AbsoluteFill>
                    <AbsoluteFill style={{ top: '50%', height: '50%' }}>
                        {renderMedia(bottomMedia, bottomMediaType, bottomMediaPosition, bottomMediaScale, bottomMediaVerticalPosition, bottomMediaFit)}
                    </AbsoluteFill>
                </>
            )}
            {backgroundMusic && (
                <Audio src={backgroundMusic} volume={volume} />
            )}
            {voiceOver && (
                <Audio src={voiceOver} volume={volume} />
            )}
        </AbsoluteFill>
    );
};

export default SplitScreenComposition;