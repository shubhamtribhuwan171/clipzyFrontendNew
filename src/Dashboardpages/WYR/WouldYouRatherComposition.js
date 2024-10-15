// WouldYouRatherComposition.js
import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, spring } from 'remotion';

// CaptionText Component
const CaptionText = ({
  children,
  size,
  color,
  strokeWidth,
  strokeColor,
  font,
  align = 'center',
  opacity = 1,
}) => (
  <div
    style={{
      fontSize: `${size}px`,
      fontWeight: 'bold',
      color: color,
      fontFamily: font,
      textAlign: align,
      WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
      padding: '10px',
      textTransform: 'uppercase',
      opacity: opacity,
    }}
  >
    {children}
  </div>
);

// CroppedImage Component
const CroppedImage = ({
  src,
  alt,
  text,
  frame,
  transitionStartFrame,
  transition,
  opacity = 1,
  scale = 1,
  rotation = 0,
  fps,
  duration = 10,
  aspectRatio,
}) => {
  const frameProgress = frame - transitionStartFrame;
  let computedOpacity = opacity;
  let computedScale = scale;
  let computedRotation = rotation;

  // Handle Transition Effects
  if (frameProgress >= 0 && frameProgress <= duration) {
    switch (transition) {
      case 'fade':
        computedOpacity = interpolate(frameProgress, [0, duration], [0, 1], { extrapolateRight: 'clamp' });
        break;
      case 'scale':
        computedScale = interpolate(frameProgress, [0, duration], [0.8, 1], { extrapolateRight: 'clamp' });
        break;
      case 'rotate':
        computedRotation = interpolate(frameProgress, [0, duration], [-10, 10], { extrapolateRight: 'clamp' });
        break;
      default:
        break;
    }
  }

  return (
    <div
      style={{
        width: '70%',
        height: '70%',
        overflow: 'hidden',
        borderRadius: aspectRatio === '16:9' ? '20px' : '0',
        position: 'relative',
        margin: '0 auto',
        border: aspectRatio === '16:9' ? '10px solid white' : 'none',
        boxShadow: aspectRatio === '16:9' ? '0 0 10px rgba(0,0,0,0.1)' : 'none',
        opacity: computedOpacity,
        transform: `scale(${computedScale}) rotate(${rotation}deg)`,
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Img
          src={src}
          alt={alt}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      {aspectRatio === '16:9' && (
        <div
          style={{
            backgroundColor: 'white',
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '24px',
            color: 'black',
            width: '100%', // Fill the entire width
            boxSizing: 'border-box', // Include padding in the width calculation
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

// Background Component for Continuous Moving Up Animation
const Background = ({ image, animation, fps }) => {
  const frame = useCurrentFrame();

  if (!image) return null;

  if (animation === 'continuousMoveUp') {
    const speed = 300; // Total frames for one complete loop (e.g., 10 seconds at 30fps)
    const loopFrame = frame % speed;
    const yOffset = interpolate(loopFrame, [0, speed], [0, -100], { extrapolate: 'clamp' });

    return (
      <>
        {/* First Image */}
        <Img
          src={image}
          style={{
            position: 'absolute',
            top: `${yOffset}%`,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Second Image */}
        <Img
          src={image}
          style={{
            position: 'absolute',
            top: `${100 + yOffset}%`,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </>
    );
  }

  // Additional animations can be added here

  return null;
};

// Main Composition Component
export const WouldYouRatherComposition = ({
  questions,
  delay,
  answerDuration,
  captionSize,
  captionColor,
  captionStrokeWidth,
  captionStrokeColor,
  captionFont,
  aspectRatio,
  backgroundImage,       // Background Image URL
  backgroundAnimation,   // Background Animation Type
  logoImage,             // Logo Image URL (New Prop)
}) => {
  const frame = useCurrentFrame();
  const fps = 30;

  const perQuestionDuration = 60 + 60 + delay * fps + 30; // Option1 + Option2 + Delay + Answer Reveal
  const totalDuration = perQuestionDuration * questions.length;

  const currentQuestionIndex = Math.floor(frame / perQuestionDuration);
  const currentQuestionFrame = frame % perQuestionDuration;

  if (currentQuestionIndex >= questions.length) {
    return <AbsoluteFill style={{ backgroundColor: '#121212' }} />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Define frame ranges for different stages
  const option1Start = 0;
  const option1End = 60;
  const option2Start = option1End;
  const option2End = option2Start + 60;
  const progressStart = option2End;
  const progressEnd = progressStart + delay * fps;
  const answerRevealStart = progressEnd;
  const answerRevealEnd = answerRevealStart + 30;

  // Calculate Opacity and Scale for Option 1
  const option1Opacity = interpolate(
    currentQuestionFrame,
    [option1Start, option1Start + 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  const option1Scale = spring({
    frame: currentQuestionFrame - option1Start,
    fps,
    from: 0.8,
    to: 1,
    durationInFrames: 10,
  });

  // Calculate Opacity and Scale for Option 2
  const option2Opacity = interpolate(
    currentQuestionFrame,
    [option2Start, option2Start + 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  const option2Scale = spring({
    frame: currentQuestionFrame - option2Start,
    fps,
    from: 0.8,
    to: 1,
    durationInFrames: 10,
  });

  // Progress Indicator Calculations
  const showProgress = currentQuestionFrame >= progressStart && currentQuestionFrame < answerRevealStart;
  const progressFrame = currentQuestionFrame - progressStart;
  const progress = interpolate(
    progressFrame,
    [0, delay * fps],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Answer Reveal Calculations
  const showAnswer = currentQuestionFrame >= answerRevealStart;
  const answerOpacity = interpolate(
    currentQuestionFrame,
    [answerRevealStart, answerRevealEnd],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Continuous Tilting Motion Calculation
  const tiltSpeed = 0.1; // Adjust for faster/slower tilting
  const tiltAmplitude = 5; // Degrees
  const tiltAngle = Math.sin(frame * tiltSpeed) * tiltAmplitude;

  return (
    <AbsoluteFill style={{ backgroundColor: '#121212', fontFamily: captionFont }}>
      {/* Background Image with Animation */}
      <Background image={backgroundImage} animation={backgroundAnimation} fps={fps} />

      {/* Question Number and Logo for Horizontal Video */}
      {aspectRatio === '16:9' && (
        <>
          {/* Question Number */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: '#FF4136', // Red background
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              zIndex: 10,
              padding: '10px 20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {currentQuestionIndex + 1}
          </div>

          {/* Logo Image */}
          {logoImage && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '100px',
                height: '100px',
                zIndex: 10,
              }}
            >
              <Img
                src={logoImage}
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}
        </>
      )}

      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: aspectRatio === '16:9' ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: aspectRatio === '16:9' ? '20px' : '0',
        }}
      >
        {/* Option 1 */}
        <div
          style={{
            flex: 1,
            height: aspectRatio === '16:9' ? '100%' : '50%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            backgroundColor: aspectRatio === '9:16' ? '#FF4136' : 'transparent',
          }}
        >
          <CroppedImage
            src={currentQuestion.option1Image || 'https://via.placeholder.com/300x150'}
            alt="Option 1"
            text={currentQuestion.option1 || 'OPTION 1'}
            frame={currentQuestionFrame}
            transitionStartFrame={option1Start}
            transition={currentQuestion.option1Transition}
            opacity={option1Opacity}
            scale={option1Scale}
            rotation={tiltAngle} // Apply tilting
            fps={fps}
            duration={10}
            aspectRatio={aspectRatio}
          />
          {aspectRatio !== '16:9' && (
            <CaptionText
              size={captionSize}
              color={captionColor}
              strokeWidth={captionStrokeWidth}
              strokeColor={captionStrokeColor}
              font={captionFont}
              opacity={showAnswer ? answerOpacity : option1Opacity}
            >
              {showAnswer ? `${currentQuestion.stat1}%` : currentQuestion.option1 || 'OPTION 1'}
            </CaptionText>
          )}
        </div>

        {/* "OR" Divider for Horizontal Video */}
        {aspectRatio === '16:9' && (
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 20px',
              alignSelf: 'center',
            }}
          >
            OR
          </div>
        )}

        {/* Option 2 */}
        <div
          style={{
            flex: 1,
            height: aspectRatio === '16:9' ? '100%' : '50%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            backgroundColor: aspectRatio === '9:16' ? '#0074D9' : 'transparent',
          }}
        >
          <CroppedImage
            src={currentQuestion.option2Image || 'https://via.placeholder.com/300x150'}
            alt="Option 2"
            text={currentQuestion.option2 || 'OPTION 2'}
            frame={currentQuestionFrame}
            transitionStartFrame={option2Start}
            transition={currentQuestion.option2Transition}
            opacity={option2Opacity}
            scale={option2Scale}
            rotation={-tiltAngle} // Apply tilting in opposite direction
            fps={fps}
            duration={10}
            aspectRatio={aspectRatio}
          />
          {aspectRatio !== '16:9' && (
            <CaptionText
              size={captionSize}
              color={captionColor}
              strokeWidth={captionStrokeWidth}
              strokeColor={captionStrokeColor}
              font={captionFont}
              opacity={showAnswer ? answerOpacity : option2Opacity}
            >
              {showAnswer ? `${currentQuestion.stat2}%` : currentQuestion.option2 || 'OPTION 2'}
            </CaptionText>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};