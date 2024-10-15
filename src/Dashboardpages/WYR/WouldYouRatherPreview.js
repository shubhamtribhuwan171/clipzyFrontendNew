// WouldYouRatherPreview.js
import React, { useCallback, forwardRef } from 'react';
import { Flex, Box, useMediaQuery } from '@chakra-ui/react';
import { Player } from '@remotion/player';
import { WouldYouRatherComposition } from './WouldYouRatherComposition';

const WouldYouRatherPreview = forwardRef((props, ref) => {
  const {
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
  } = props;

  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const renderComposition = useCallback(
    () => (
      <WouldYouRatherComposition
        questions={questions}
        delay={delay}
        answerDuration={answerDuration}
        captionSize={captionSize}
        captionColor={captionColor}
        captionStrokeWidth={captionStrokeWidth}
        captionStrokeColor={captionStrokeColor}
        captionFont={captionFont}
        aspectRatio={aspectRatio}
        backgroundImage={backgroundImage}
        backgroundAnimation={backgroundAnimation}
        logoImage={logoImage}
      />
    ),
    [
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
    ]
  );

  return (
    <Flex>
      <Box
        w="100%"
        h="auto"
        maxW={isMobile ? "100%" : aspectRatio === '16:9' ? '640px' : '360px'}
        maxH={isMobile ? "auto" : aspectRatio === '16:9' ? '360px' : '640px'}
      >
        <Player
          ref={ref}
          component={renderComposition}
          durationInFrames={(60 + 60 + (delay * 30) + 30) * questions.length}
          compositionWidth={aspectRatio === '16:9' ? 1920 : 1080}
          compositionHeight={aspectRatio === '16:9' ? 1080 : 1920}
          fps={30}
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: aspectRatio === '16:9' ? '16/9' : '9/16',
          }}
          controls
        />
      </Box>
    </Flex>
  );
});

export default WouldYouRatherPreview;
