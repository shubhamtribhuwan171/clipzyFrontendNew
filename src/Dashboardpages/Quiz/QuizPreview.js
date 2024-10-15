// QuizPreview.js

import React, { useMemo } from 'react';
import { Player } from '@remotion/player';
import QuizComposition from './QuizComposition'; // Changed to default import
import { Box, Flex } from '@chakra-ui/react';

const QuizPreview = React.memo(function QuizPreview({
  questions,
  delay,
  answerDuration,
  captionSize,
  captionColor,
  captionStrokeWidth,
  captionStrokeColor,
  captionFont,
  aspectRatio,
  backgroundImage,
  backgroundAnimation,
  logoImage,
  playerRef,
  showConfetti,
  showBackgroundAnimation,
  selectedAudio,
  showProgressImage,
  progressImage,
}) {
  const durationInFrames =
    (90 + delay * 30 + answerDuration * 30) * questions.length;

  const renderComposition = useMemo(() => QuizComposition, []);

  return (
    <Flex w="50%" bg="gray.900" p={4} direction="column" align="center" justify="center">
      <Box
        w="full"
        h="full"
        maxW={aspectRatio === '16:9' ? '100%' : '56.25vw'}
        maxH={aspectRatio === '16:9' ? '56.25vw' : '100%'}
      >
        <Player
          ref={playerRef}
          component={renderComposition}
          durationInFrames={durationInFrames}
          compositionWidth={aspectRatio === '16:9' ? 1920 : 1080}
          compositionHeight={aspectRatio === '16:9' ? 1080 : 1920}
          fps={30}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          inputProps={{
            questions,
            delay,
            answerDuration,
            captionSize,
            captionColor,
            captionStrokeWidth,
            captionStrokeColor,
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
          }}
        />
      </Box>
    </Flex>
  );
});

export default QuizPreview;
