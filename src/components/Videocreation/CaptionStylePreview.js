import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import CaptionPreviewCard from './CaptionPreviewCard';
import wordTimings from './word_timings.json';
import captionStyles from './caption_style.json';

const CaptionStylePreview = ({ styleName, isSelected, onSelect, label }) => {
  const captionStyle = captionStyles[styleName] || captionStyles.defaultStyle;

  return (
    <VStack
      onClick={onSelect}
      cursor="pointer"
      borderWidth={2}
      borderColor={isSelected ? "blue.500" : "transparent"}
      borderRadius="md"
      p={2}
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <Text fontSize="sm" fontWeight="bold" textAlign="center" mb={1}>
        {label}
      </Text>
      <Box width="100%" height="80px" overflow="hidden">
        <CaptionPreviewCard
          captionStyle={captionStyle}
          wordTimings={wordTimings.slice(0, 1)} // Use only first line for thumbnail preview
          isThumbnail={true}
        />
      </Box>
      {isSelected && <Text fontSize="xs" color="blue.500">Selected</Text>}
    </VStack>
  );
};

export default CaptionStylePreview;
