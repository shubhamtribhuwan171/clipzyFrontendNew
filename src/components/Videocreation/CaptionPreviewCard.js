import React, { useEffect, useState, useRef } from 'react';
import './CaptionPreviewCard.css';

const CaptionPreviewCard = ({ captionStyle, wordTimings, isThumbnail = false }) => {
  const [currentTime, setCurrentTime] = useState(0); // Current playback time in seconds
  const [isLooping, setIsLooping] = useState(true); // Enable looping by default
  const [updateInterval, setUpdateInterval] = useState(100); // Update every 100ms for smooth playback
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  // Calculate total duration based on word timings
  const totalDuration = Math.max(
    ...wordTimings.flatMap(line => line.words.map(word => word.end))
  );

  useEffect(() => {
    // Start playback automatically on mount
    setIsLooping(true);
    setCurrentTime(0);
    pausedTimeRef.current = 0;
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000; // in seconds
      if (elapsed >= totalDuration) {
        if (isLooping) {
          setCurrentTime(0);
          startTimeRef.current = Date.now();
        } else {
          clearInterval(timerRef.current);
          setCurrentTime(totalDuration);
        }
      } else {
        setCurrentTime(elapsed);
      }
    }, updateInterval);

    return () => clearInterval(timerRef.current); // Clean up on unmount
  }, [isLooping, updateInterval, totalDuration]);

  // Determine the status of each word based on currentTime
  const getWordsWithStatus = () => {
    return wordTimings.map((line) => ({
      lineIndex: line.lineIndex,
      words: line.words.map((word) => ({
        ...word,
        status: currentTime >= word.start && currentTime < word.end ? 'current' : 'normal'
      })),
    }));
  };

  const wordsWithStatus = getWordsWithStatus();

  // Generate inline styles based on captionStyle.json
  const captionCardStyle = {
    backgroundColor: captionStyle.backgroundColor || 'rgba(0, 0, 0, 0.7)',
    fontFamily: captionStyle.fontFamily || 'Montserrat, sans-serif',
    fontSize: isThumbnail ? `${(captionStyle.fontSize || 24) / 2}px` : `${captionStyle.fontSize || 24}px`,
    fontWeight: captionStyle.fontWeight || 'normal',
    fontStyle: captionStyle.fontStyle || 'normal',
    textAlign: captionStyle.textAlignment || 'center',
    lineHeight: captionStyle.lineHeight || '1.5',
    textTransform: captionStyle.textCase === 'Upper Case' ? 'uppercase' : 
                   captionStyle.textCase === 'Lower Case' ? 'lowercase' : 'none',
    color: captionStyle.textColor || '#FFFFFF',
    textShadow: captionStyle.textEffect === 'Glow' ? '0 0 10px rgba(255,255,255,0.8)' : 'none',
    WebkitTextStroke: captionStyle.textStrokeWidth ? `${isThumbnail ? captionStyle.textStrokeWidth / 2 : captionStyle.textStrokeWidth}px ${captionStyle.textStrokeColor || '#000000'}` : 'none',
    width: isThumbnail ? '100%' : undefined,
    height: isThumbnail ? '100%' : undefined,
    overflow: isThumbnail ? 'hidden' : undefined,
    padding: isThumbnail ? '4px' : '16px',
  };

  const currentWordStyle = {
    color: captionStyle.highlightColor || '#ff00b3',
    fontWeight: 'bold',
    backgroundColor: captionStyle.highlightBackgroundColor || 'rgba(0, 0, 0, 0.7)',
    padding: isThumbnail ? '1px 2px' : '2px 4px',
    borderRadius: `${(captionStyle.highlightCornerRadius || 4) / (isThumbnail ? 2 : 1)}px`,
    WebkitTextStroke: captionStyle.highlightStrokeWidth ? `${isThumbnail ? captionStyle.highlightStrokeWidth / 2 : captionStyle.highlightStrokeWidth}px ${captionStyle.highlightStrokeColor || '#000000'}` : 'none',
  };

  return (
    <div className={`card-container ${isThumbnail ? 'thumbnail' : ''}`}>
      <div className="caption-card" style={captionCardStyle}>
        <div className="caption-content">
          {wordsWithStatus.map((line, lIndex) => (
            <p
              key={`line-${lIndex}`}
              className="caption-line"
              style={{ margin: isThumbnail ? '0' : undefined }}
            >
              {line.words.map((word, wIndex) => (
                <span
                  key={`word-${wIndex}`}
                  className={word.status === 'current' ? 'current-word' : ''}
                  style={word.status === 'current' ? currentWordStyle : {}}
                >
                  {word.text}{' '}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaptionPreviewCard;
