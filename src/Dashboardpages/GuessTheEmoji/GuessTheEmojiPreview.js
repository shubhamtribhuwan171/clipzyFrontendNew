// GuessTheEmojiPreview.js

import React, { useMemo } from 'react';
import { Player } from '@remotion/player';
import GuessTheEmojiComposition from './GuessTheEmojiComposition';
import { Box, Flex } from '@chakra-ui/react';

const GuessTheEmojiPreview = React.memo(function GuessTheEmojiPreview({
  questions,
  delay,
  answerDuration,
  captionFont,
  aspectRatio,
  backgroundImage,
  backgroundAnimation,
  logoImage,
  playerRef,
  showProgressImage,
  progressImage,
}) {
  const durationInFrames = (90 + delay * 30 + answerDuration * 30) * questions.length;

  const renderComposition = useMemo(() => GuessTheEmojiComposition, []);

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
            captionFont,
            aspectRatio,
            backgroundImage,
            backgroundAnimation,
            logoImage,
            showProgressImage,
            progressImage,
          }}
        />
      </Box>
    </Flex>
  );
});

export default GuessTheEmojiPreview;
