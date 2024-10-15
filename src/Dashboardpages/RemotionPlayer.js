import React, { useState, useEffect, useMemo } from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import initialClips from './data/initialClips';

const captionStyle = {
  fontFamily: "MONTSERRAT, sans-serif",
  fontSize: 24,
  fontWeight: "normal",
  fontStyle: "normal",
  textCase: "UPPER CASE",  // Changed to uppercase
  textColor: "#FFFFFF",
  highlightColor: "#15d8ed",  // Changed highlight color to blue
  highlightStrokeColor: "#000000",
  highlightBackgroundColor: "None",
  textAlignment: "center",
  textEffect: "None",
  backgroundColor: "transparent",
  backgroundGradient: ["#000000", "#FFFFFF"],
  backgroundBlur: 0,
  emphasisTechnique: "Bold",
  wordsPerLine: 5,
  lineHeight: 1.5,
  effectIntensity: 50,
  textStrokeWidth: 0,
  textStrokeColor: "#000000",
  highlightStrokeWidth: 0,
  highlightCornerRadius: 4,
  renderingEffect: "All at once"
};

// Function to split text into lines based on the logic in process_scene.py
function splitTextIntoLines(data, MaxChars = 40, MaxDuration = 2.5, MaxGap = 1.5, MaxWords = 5) {
  const subtitles = [];
  let line = [];
  let lineDuration = 0;
  let lineChars = 0;
  let lineWords = 0;

  for (let idx = 0; idx < data.length; idx++) {
    const wordData = data[idx];
    const word = wordData.word;
    const start = wordData.start;
    const end = wordData.end;

    line.push(wordData);
    lineDuration += end - start;
    lineChars += word.length;
    lineWords += 1;

    const gap = idx > 0 ? start - data[idx - 1].end : 0;

    const shouldSplit = (
      lineDuration > MaxDuration ||
      lineChars > MaxChars ||
      gap > MaxGap ||
      lineWords >= MaxWords ||
      /[.,?!]/.test(word.slice(-1))
    );

    if (shouldSplit && line.length > 0) {
      subtitles.push({
        word: line.map(item => item.word).join(' '),
        start: line[0].start,
        end: line[line.length - 1].end,
        textcontents: line
      });
      line = [];
      lineDuration = 0;
      lineChars = 0;
      lineWords = 0;
    }
  }

  if (line.length > 0) {
    subtitles.push({
      word: line.map(item => item.word).join(' '),
      start: line[0].start,
      end: line[line.length - 1].end,
      textcontents: line
    });
  }

  return subtitles;
}

// Convert initialClips to scenes format
const scenes = initialClips.map(clip => ({
  title: `Scene ${clip.id}`,
  start_time: clip.startTime,
  end_time: clip.startTime + clip.duration
}));

function RemotionPlayer({ currentClip, currentTime, wordTimings, timelineImages, scenes }) {
  const [currentChunk, setCurrentChunk] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);

  // Determine which image to show based on currentTime or currentClip
  const currentImageIndex = scenes.findIndex(scene =>
    currentTime >= scene.start_time && currentTime < scene.end_time
  );

  // Preprocess word timings to create subtitle chunks
  const subtitleChunks = useMemo(() => splitTextIntoLines(wordTimings, 40, 2.5, 1.5, captionStyle.wordsPerLine), [wordTimings]);

  useEffect(() => {
    // Find the current subtitle chunk
    const chunk = subtitleChunks.find(chunk => currentTime >= chunk.start && currentTime < chunk.end);
    setCurrentChunk(chunk);

    // Find the current word within the chunk
    if (chunk && chunk.textcontents) {
      const word = chunk.textcontents.find(word => currentTime >= word.start && currentTime < word.end);
      setCurrentWord(word);
    } else {
      setCurrentWord(null);
    }
  }, [currentTime, subtitleChunks]);

  const wrappedLines = useMemo(() => {
    if (!currentChunk) return [];
    const text = currentChunk.textcontents.map(item => item.word).join(' ');
    const words = text.split(' ');
    const lines = [];
    for (let i = 0; i < words.length; i += captionStyle.wordsPerLine) {
      lines.push(words.slice(i, i + captionStyle.wordsPerLine).join(' '));
    }
    return lines;
  }, [currentChunk]);

  return (
    <Box
      width="100%"
      maxWidth="414px"
      height="100%"
      maxHeight="896px"
      margin="0 auto"
      position="relative"
      overflow="hidden"
      borderRadius="md"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
    >
      {currentImageIndex !== -1 && (
        <Image
          src={timelineImages[currentImageIndex]}
          alt={`Scene image ${currentImageIndex + 1}`}
          objectFit="cover"
          width="100%"
          height="100%"
        />
      )}
      <Box
        position="absolute"
        top="50%"  // Position captions in the middle vertically
        left="50%"
        transform="translate(-50%, -50%)"  // Center horizontally and vertically
        width="90%"
        textAlign={captionStyle.textAlignment}
      >
        {wrappedLines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text
              fontFamily={captionStyle.fontFamily}
              fontSize={`${captionStyle.fontSize}px`}
              fontWeight={captionStyle.emphasisTechnique === "Bold" ? "bold" : captionStyle.fontWeight}
              fontStyle={captionStyle.fontStyle}
              color={captionStyle.textColor}
              textTransform={captionStyle.textCase === "UPPER CASE" ? "uppercase" : "none"}
              mb={2}
              textShadow={`${captionStyle.textStrokeWidth}px ${captionStyle.textStrokeWidth}px 0 ${captionStyle.textStrokeColor}`}
              sx={{
                background: captionStyle.highlightBackgroundColor,
                padding: '4px 8px',
                borderRadius: `${captionStyle.highlightCornerRadius}px`,
                boxDecorationBreak: 'clone',
                WebkitBoxDecorationBreak: 'clone',
                lineHeight: captionStyle.lineHeight,
                whiteSpace: 'pre-wrap',
              }}
            >
              {/* Render words with highlighting */}
              {line.split(' ').map((word, idx) => {
                const isCurrentWord = currentWord && word.toUpperCase() === currentWord.word.toUpperCase();
                return (
                  <span
                    key={idx}
                    style={{
                      color: isCurrentWord ? captionStyle.highlightColor : captionStyle.textColor,
                      textShadow: isCurrentWord ? `${captionStyle.highlightStrokeWidth}px ${captionStyle.highlightStrokeWidth}px 0 ${captionStyle.highlightStrokeColor}` : undefined,
                    }}
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </Text>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}

export default RemotionPlayer;