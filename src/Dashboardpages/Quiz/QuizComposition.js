// QuizComposition.js

import React from 'react';
import { AbsoluteFill, useCurrentFrame, Img, interpolate, Audio } from 'remotion';
import Confetti from 'react-confetti';

// Define the QuizComposition component
const QuizComposition = ({
  questions,
  delay,
  answerDuration,
  captionFont,
  aspectRatio,
  backgroundImage,
  backgroundAnimation,
  logoImage,
  showConfetti,
  showBackgroundAnimation,
  selectedAudio,
  showProgressImage,
  progressImage,
}) => {
  const frame = useCurrentFrame();
  const fps = 30; // Frames per second

  // Calculate durations in frames
  const initialPhaseDuration = 90; // 3 seconds
  const delayDuration = delay * fps; // Delay before revealing answer
  const answerRevealDuration = answerDuration * fps; // Duration to reveal the answer
  const perQuestionDuration = initialPhaseDuration + delayDuration + answerRevealDuration;

  // Determine the current question index based on the current frame
  const currentQuestionIndex = Math.floor(frame / perQuestionDuration);
  const currentQuestionFrame = frame % perQuestionDuration;

  // If all questions have been displayed, render nothing
  if (currentQuestionIndex >= questions.length) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Define frame ranges for different elements
  const questionNumberStart = 0;
  const questionNumberEnd = 30; // Fade in over 1 second

  const questionTextStart = 0;
  const questionTextEnd = 30; // Fade in over 1 second

  const questionImageStart = 0;
  const questionImageEnd = 30; // Fade in over 1 second

  const optionsStartTimes =
    currentQuestion.type === 'text' ? [30, 45, 60, 75] : [30, 45]; // When each option starts to appear
  const optionsFadeInDuration = 15; // Fade in over 0.5 seconds

  const progressStart = initialPhaseDuration; // Start of delay before answer
  const progressEnd = progressStart + delayDuration; // End of delay

  const answerRevealStart = progressEnd; // Start of answer reveal
  const answerRevealEnd = answerRevealStart + answerRevealDuration; // End of answer reveal

  // Calculate opacities for fading effects
  const questionNumberOpacity = interpolate(
    currentQuestionFrame,
    [questionNumberStart, questionNumberEnd],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const questionTextOpacity = interpolate(
    currentQuestionFrame,
    [questionTextStart, questionTextEnd],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const questionImageOpacity =
    currentQuestion.type === 'text'
      ? interpolate(
          currentQuestionFrame,
          [questionImageStart, questionImageEnd],
          [0, 1],
          { extrapolateRight: 'clamp' }
        )
      : 0;

  // Determine if the aspect ratio is vertical
  const isVertical = aspectRatio === '9:16';

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

  // Determine if the progress bar should be shown
  const showProgress = currentQuestionFrame >= progressStart && currentQuestionFrame < progressEnd;
  const progressFrame = currentQuestionFrame - progressStart;
  const progress = interpolate(progressFrame, [0, delayDuration], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Determine if the answer reveal should be shown
  const showAnswer = currentQuestionFrame >= answerRevealStart;
  const answerOpacity = interpolate(
    currentQuestionFrame,
    [answerRevealStart, answerRevealEnd],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Define fixed sizes for image containers based on aspect ratio
  const imageSizes = isVertical
    ? {
        questionImage: { width: 900, height: 506 }, // Increased size for vertical view
        optionImage: { width: 700, height: 525 }, // Increased size for vertical view
      }
    : {
        questionImage: { width: 640, height: 360 },
        optionImage: { width: 640, height: 360 },
      };

  // Function to render options based on quiz type
  const renderOption = (option, index) => {
    if (currentQuestion.type === 'text') {
      const optionText = currentQuestion[`option${option}`];
      if (!optionText) return null;

      const isCorrect = currentQuestion.correctAnswer === option;
      const optionStartTime = optionsStartTimes[index];
      const optionOpacity = interpolate(
        currentQuestionFrame,
        [optionStartTime, optionStartTime + optionsFadeInDuration],
        [0, 1],
        { extrapolateRight: 'clamp' }
      );

      return (
        <div key={option} style={{ opacity: optionOpacity, transition: 'opacity 0.3s ease' }}>
          <OptionComponent
            optionLabel={option}
            optionText={optionText}
            isCorrect={isCorrect}
            showAnswer={showAnswer}
            isVertical={isVertical}
          />
        </div>
      );
    } else if (currentQuestion.type === 'image') {
      // For image-based quizzes, options are images themselves
      // No need to render options separately to avoid duplication
      return null;
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundImage ? 'transparent' : '#1BFFFF',
        fontFamily: captionFont,
        overflow: 'hidden',
        padding: isVertical ? '20px' : '40px', // Add padding based on aspect ratio
      }}
    >
      {/* Background Image with Animation */}
      {backgroundImage && (
        <div
          style={{
            position: 'absolute',
            width: '200%', // To allow infinite scrolling
            height: '200%', // Increased height for vertical animations
            overflow: 'hidden',
          }}
        >
          <Img
            src={backgroundImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...(showBackgroundAnimation && backgroundAnimation !== 'none'
                ? getBackgroundStyle()
                : {}),
            }}
            alt="Background"
          />
        </div>
      )}

      {/* Background Music */}
      {selectedAudio && <Audio src={selectedAudio} />}

      {/* Logo Image */}
      {logoImage && (
        <div
          style={{
            position: 'absolute',
            top: isVertical ? '20px' : '40px', // Moved down for widescreen
            right: isVertical ? '20px' : '40px', // Moved left for widescreen
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
          top: isVertical ? '20px' : '40px', // Moved down for widescreen
          left: isVertical ? '20px' : '40px', // Moved right for widescreen
          backgroundColor: '#FF1493',
          color: 'white',
          fontSize: isVertical ? '28px' : '36px',
          fontWeight: 'bold',
          zIndex: 10,
          padding: '10px',
          borderRadius: '50%',
          width: isVertical ? '50px' : '60px',
          height: isVertical ? '50px' : '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: questionNumberOpacity,
          border: '3px solid white',
          boxSizing: 'border-box',
        }}
      >
        {currentQuestionIndex + 1}
      </div>

      {/* Question Text */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? '100px' : '120px', // Moved down for widescreen
          left: '50%',
          transform: 'translateX(-50%)',
          width: isVertical ? '90%' : '80%',
          color: 'white',
          fontSize: isVertical ? '36px' : '40px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          opacity: questionTextOpacity,
          textAlign: 'center',
        }}
      >
        {currentQuestion.question}
      </div>

      {/* Question Image with Fade-In (for Text-Based Quiz) */}
      {currentQuestion.type === 'text' && currentQuestion.questionImage && (
        <div
          style={{
            position: 'absolute',
            top: isVertical ? '30%' : '50%',
            left: isVertical ? '50%' : '25%', // Center of the left half for widescreen
            transform: isVertical ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
            width: `${imageSizes.questionImage.width}px`,
            height: `${imageSizes.questionImage.height}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: questionImageOpacity,
            overflow: 'hidden',
            borderRadius: '20px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            border: '10px solid white', // Consistent white border
            boxSizing: 'border-box',
          }}
        >
          <Img
            src={currentQuestion.questionImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px', // Slightly smaller radius to account for the border
            }}
            alt="Question"
          />
        </div>
      )}

      {/* Image-Based Quiz Layout */}
      {currentQuestion.type === 'image' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: isVertical ? '15%' : '40%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              width: isVertical ? '90%' : '80%',
              display: 'flex',
              flexDirection: isVertical ? 'column' : 'row',
              gap: '20px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Option A Image */}
            {currentQuestion.imageOptionA && (
              <div
                style={{
                  width: `${imageSizes.optionImage.width}px`,
                  height: `${imageSizes.optionImage.height}px`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                <ImageOptionComponent
                  optionLabel="A"
                  optionImage={currentQuestion.imageOptionA}
                  isCorrect={currentQuestion.correctAnswer === 'A'}
                  showAnswer={showAnswer}
                  isVertical={isVertical}
                />
              </div>
            )}

            {/* Option B Image */}
            {currentQuestion.imageOptionB && (
              <div
                style={{
                  width: `${imageSizes.optionImage.width}px`,
                  height: `${imageSizes.optionImage.height}px`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                <ImageOptionComponent
                  optionLabel="B"
                  optionImage={currentQuestion.imageOptionB}
                  isCorrect={currentQuestion.correctAnswer === 'B'}
                  showAnswer={showAnswer}
                  isVertical={isVertical}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Options for Text-Based Quizzes */}
      {currentQuestion.type === 'text' && (
        <div
          style={{
            position: 'absolute',
            top: isVertical ? '60%' : '50%',
            left: isVertical ? '50%' : '75%', // Center of the right half for widescreen
            transform: isVertical ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            width: isVertical ? '95%' : '40%', // Increased width for vertical
            maxWidth: isVertical ? 'none' : '500px', // Maximum width for widescreen
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {['A', 'B', 'C', 'D'].map((option, index) => renderOption(option, index))}
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
            overflow: 'visible', // Changed to 'visible' to allow image to extend beyond
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

      {/* Difficulty Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          display: 'flex',
          gap: '10px',
        }}
      >
        {['EASY', 'MEDIUM', 'HARD'].map((difficulty, index) => (
          <div
            key={difficulty}
            style={{
              backgroundColor:
                index === ['easy', 'medium', 'hard'].indexOf(currentQuestion.difficulty)
                  ? '#32CD32'
                  : 'rgba(255, 255, 255, 0.3)',
              color:
                index === ['easy', 'medium', 'hard'].indexOf(currentQuestion.difficulty)
                  ? 'white'
                  : 'rgba(255, 255, 255, 0.7)',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {difficulty}
          </div>
        ))}
      </div>

      {/* Answer Reveal */}
      {showAnswer && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: answerOpacity,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          {showConfetti && (
            <Confetti
              width={isVertical ? 1080 : 1920}
              height={isVertical ? 1920 : 1080}
              recycle={false}
              numberOfPieces={200}
              gravity={0.1}
            />
          )}
          {/* Additional answer reveal content can be added here */}
        </div>
      )}

      {/* CSS Keyframes for Progress Bar Animation */}
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

// OptionComponent for Text-Based Options
const OptionComponent = ({ optionLabel, optionText, isCorrect, showAnswer, isVertical }) => {
  const baseStyle = {
    backgroundColor: showAnswer && isCorrect ? '#32CD32' : 'white',
    color: showAnswer && isCorrect ? 'white' : 'black',
    padding: '15px 20px',
    borderRadius: '30px',
    fontSize: isVertical ? '28px' : '24px', // Increased font size for vertical
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    transform: showAnswer && isCorrect ? 'scale(1.05)' : 'scale(1)',
  };

  return (
    <div style={baseStyle}>
      <span
        style={{
          backgroundColor: showAnswer && isCorrect ? 'white' : '#FF1493',
          color: showAnswer && isCorrect ? '#32CD32' : 'white',
          borderRadius: '50%',
          width: isVertical ? '40px' : '36px', // Slightly larger for vertical
          height: isVertical ? '40px' : '36px', // Slightly larger for vertical
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '15px',
          flexShrink: 0,
          fontSize: isVertical ? '24px' : '20px', // Increased font size for vertical
        }}
      >
        {optionLabel}
      </span>
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {optionText}
      </span>
    </div>
  );
};

// OptionButton Component for Image-Based Options
const OptionButton = ({ label, isCorrect }) => {
  return (
    <div
      style={{
        backgroundColor: isCorrect ? '#32CD32' : 'rgba(255, 255, 255, 0.3)',
        color: isCorrect ? 'white' : 'black',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '60px', // Adjust as needed
        boxSizing: 'border-box',
      }}
    >
      {label}
    </div>
  );
};

// ImageOptionComponent for Image-Based Options
const ImageOptionComponent = ({ optionLabel, optionImage, isCorrect, showAnswer, isVertical }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '18px',
        border: showAnswer && isCorrect ? '10px solid #32CD32' : '10px solid white',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        transform: showAnswer && isCorrect ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <Img
        src={optionImage}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        alt={`Option ${optionLabel}`}
      />
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: showAnswer && isCorrect ? '#32CD32' : '#FF1493',
          color: 'white',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        {optionLabel}
      </div>
      {showAnswer && isCorrect && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(50, 205, 50, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '48px', color: 'white' }}>✓</span>
        </div>
      )}
    </div>
  );
};

export default QuizComposition;