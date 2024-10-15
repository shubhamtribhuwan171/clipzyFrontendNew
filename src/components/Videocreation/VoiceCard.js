import React, { useState, useRef } from 'react';
import { Box, Text, IconButton, Tag, HStack, VStack, useColorModeValue } from '@chakra-ui/react';
import { FaPlay, FaPause } from 'react-icons/fa';

function VoiceCard({ voice, onSelect, isSelected, isMobile }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const getTagColor = (tag) => {
    const colors = {
      American: 'red',
      Male: 'blue',
      Explainer: 'green',
    };
    return colors[tag] || 'gray';
  };

  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      borderColor={isSelected ? 'blue.500' : borderColor}
      bg={bgColor}
      p={isMobile ? 2 : 4}
      cursor="pointer"
      onClick={onSelect}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
      display="flex"
      alignItems="center"
    >
      <VStack align="start" spacing={isMobile ? 1 : 2} flex={1}>
        <Text fontWeight="bold" fontSize={isMobile ? "sm" : "lg"} color={textColor}>
          {voice.name}
        </Text>
        <HStack wrap="wrap" spacing={1}>
          <Tag size="sm" colorScheme={getTagColor(voice.accent)}>{voice.accent}</Tag>
          <Tag size="sm" colorScheme={getTagColor(voice.age)}>{voice.age}</Tag>
          <Tag size="sm" colorScheme={getTagColor(voice.gender)}>{voice.gender}</Tag>
          {!isMobile && <Tag size="sm" colorScheme={getTagColor(voice.use_case)}>{voice.use_case}</Tag>}
        </HStack>
      </VStack>
      <IconButton
        size={isMobile ? "sm" : "md"}
        icon={isPlaying ? <FaPause /> : <FaPlay />}
        onClick={handlePlayPause}
        colorScheme="blue"
        variant="outline"
        ml={2}
        aria-label={isPlaying ? "Pause" : "Play"}
      />
      <audio ref={audioRef} src={voice.preview_url} onEnded={() => setIsPlaying(false)} />
    </Box>
  );
}

export default VoiceCard;
