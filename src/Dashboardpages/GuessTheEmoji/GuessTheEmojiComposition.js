// GuessTheEmojiComposition.js

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Img } from 'remotion';
import Confetti from 'react-confetti';

const GuessTheEmojiComposition = ({
  questions,
  delay,
  answerDuration,
  captionFont,
  aspectRatio,
  backgroundImage,
  backgroundAnimation,
  logoImage,
  showProgressImage,
  progressImage,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;

  const initialPhaseDuration = 90; // 3 seconds
  const questionDisplayDuration = 30; // 1 second
  const emojiDisplayDuration = 60; // 2 seconds
  const delayDuration = delay * fps;
  const answerRevealDuration = answerDuration * fps;
  const perQuestionDuration = initialPhaseDuration + delayDuration + answerRevealDuration;
  const currentQuestionIndex = Math.floor(frame / perQuestionDuration);
  const currentQuestionFrame = frame % perQuestionDuration;

  if (currentQuestionIndex >= questions.length) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isVertical = aspectRatio === '9:16';

  // Determine which elements to show based on the current frame
  const showQuestion = currentQuestionFrame >= 0 && currentQuestionFrame < initialPhaseDuration + delayDuration;
  const showEmojis = currentQuestionFrame >= questionDisplayDuration && currentQuestionFrame < initialPhaseDuration + delayDuration;
  const showProgress = currentQuestionFrame >= initialPhaseDuration && currentQuestionFrame < initialPhaseDuration + delayDuration;
  const showAnswer = currentQuestionFrame >= initialPhaseDuration + delayDuration;

  // Background Animation Logic
  const getBackgroundStyle = () => {
    let translateX = 0;
    let translateY = 0;

    switch (backgroundAnimation) {
      case 'left':
        translateX = interpolate(frame, [0, fps * 60], [0, -100], {
          extrapolateRight: 'loop',
        });
        break;
      case 'right':
        translateX = interpolate(frame, [0, fps * 60], [0, 100], {
          extrapolateRight: 'loop',
        });
        break;
      case 'up':
        translateY = interpolate(frame, [0, fps * 60], [0, -100], {
          extrapolateRight: 'loop',
        });
        break;
      case 'down':
        translateY = interpolate(frame, [0, fps * 60], [0, 100], {
          extrapolateRight: 'loop',
        });
        break;
      default:
        break;
    }

    return {
      transform: `translate(${translateX}%, ${translateY}%)`,
      transition: 'transform 0.1s linear',
    };
  };

  // Determine progress for the progress bar
  const progressFrame = currentQuestionFrame - initialPhaseDuration;
  const progress = interpolate(progressFrame, [0, delayDuration], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Determine opacity for answer reveal
  const answerOpacity = interpolate(
    currentQuestionFrame,
    [initialPhaseDuration + delayDuration, initialPhaseDuration + delayDuration + answerRevealDuration],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundImage ? 'transparent' : '#1BFFFF',
        fontFamily: captionFont,
        overflow: 'hidden',
        padding: isVertical ? '20px' : '40px',
      }}
    >
      {/* Background Image with Animation */}
      {backgroundImage && (
        <div
          style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            overflow: 'hidden',
          }}
        >
          <Img
            src={backgroundImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...(backgroundAnimation !== 'none' ? getBackgroundStyle() : {}),
            }}
            alt="Background"
          />
        </div>
      )}

      {/* Logo Image */}
      {logoImage && (
        <div
          style={{
            position: 'absolute',
            top: isVertical ? '20px' : '40px',
            right: isVertical ? '20px' : '40px',
            width: isVertical ? '80px' : '100px',
            height: isVertical ? '80px' : '100px',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            border: '5px solid white',
            boxSizing: 'border-box',
          }}
        >
          <Img
            src={logoImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            alt="Logo"
          />
        </div>
      )}

      {/* Question Number */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#32CD32',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        }}
      >
        {currentQuestionIndex + 1}
      </div>

      {/* Question Display */}
      {showQuestion && (
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: isVertical ? '48px' : '64px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            width: '90%',
          }}
        >
          {currentQuestion.question}
        </div>
      )}

      {/* Emojis Display */}
      {showEmojis && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'row',
            gap: '40px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentQuestion.emojis.map((emoji, index) => {
            const scale = interpolate(
              frame % 120,
              [0, 60, 120],
              [1, 1.1, 1],
              {
                extrapolateRight: 'clamp',
                easing: (t) => Math.sin((t * Math.PI) / 2),
              }
            );

            return (
              <div
                key={index}
                style={{
                  fontSize: isVertical ? '100px' : '200px',
                  transform: `scale(${scale})`,
                  transition: 'transform 0.1s linear',
                }}
              >
                {emoji}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Content Container (Answer Image and Text) */}
      {showAnswer && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isVertical ? '92%' : '82%',
            height: isVertical ? '62%' : '72%',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            border: '4px solid rgba(255,255,255,0.8)',
          }}
        >
          {/* Answer Image */}
          {currentQuestion.answerImage && (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <Img
                src={currentQuestion.answerImage}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                alt="Answer"
              />
            </div>
          )}

          {/* Answer Text Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              backgroundColor: 'rgba(0, 191, 255, 1)', // Full opacity
              borderRadius: '30px',
              padding: '15px 30px',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <div
              style={{
                fontSize: isVertical ? '32px' : '44px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {currentQuestion.answer}
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <div
          style={{
            position: 'absolute',
            bottom: isVertical ? '80px' : '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isVertical ? '80%' : '60%',
            height: isVertical ? '40px' : '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '30px',
            overflow: 'visible',
            border: '2px solid white',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              backgroundColor: '#32CD32',
              borderRadius: '28px',
              backgroundImage:
                'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)',
              backgroundSize: '40px 40px',
              animation: 'stripes 1s linear infinite',
              position: 'relative',
            }}
          >
            {showProgressImage && progressImage && (
              <div
                style={{
                  position: 'absolute',
                  right: '-30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: isVertical ? '80px' : '120px',
                  height: isVertical ? '80px' : '120px',
                  transition: 'right 0.3s linear',
                }}
              >
                <Img
                  src={progressImage}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  alt="Progress Indicator"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confetti */}
      {showAnswer && (
        <Confetti
          width={isVertical ? 1080 : 1920}
          height={isVertical ? 1920 : 1080}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}

      {/* CSS Keyframes for Animations */}
      <style>
        {`
          @keyframes stripes {
            0% { background-position: 0 0; }
            100% { background-position: 40px 40px; }
          }
        `}
      </style>
    </AbsoluteFill>
  );
};


export default GuessTheEmojiComposition;
