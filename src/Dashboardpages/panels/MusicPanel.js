import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Grid,
  GridItem,
  VStack,
  HStack,
  useColorModeValue,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  ChevronRightIcon,
  InfoOutlineIcon,
  TriangleDownIcon,
} from '@chakra-ui/icons';
import { audioData } from '../../data/audioData'; // Adjust the path if necessary

const MusicPanel = () => {
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (selectedMusic) {
      audioRef.current.src = selectedMusic.audio_url;
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    // Cleanup on unmount or when selectedMusic changes
    return () => {
      audioRef.current.pause();
    };
  }, [selectedMusic, isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  const handleMusicClick = useCallback((track) => {
    setSelectedMusic((prevSelected) =>
      prevSelected?.audio_id === track.audio_id ? null : track
    );
    setIsPlaying(false);
  }, []);

  const togglePlayPause = () => {
    if (selectedMusic) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const selectedBgColor = useColorModeValue('blue.100', 'blue.700');

  return (
    <Box bg={bgColor} p={4} height="100%" borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Music Selection
        </Text>
        {selectedMusic && (
          <Box borderWidth={1} borderColor={borderColor} p={4} borderRadius="md">
            <VStack spacing={3} align="stretch">
              <HStack justifyContent="space-between">
                <Text fontSize="lg" fontWeight="semibold">
                  {selectedMusic.audio_name}
                </Text>
                <HStack>
                  <Tooltip label={isPlaying ? 'Stop' : 'Play'}>
                    <IconButton
                      icon={isPlaying ? <InfoOutlineIcon /> : <ChevronRightIcon />}
                      onClick={togglePlayPause}
                      aria-label={isPlaying ? 'Stop music' : 'Play music'}
                      colorScheme={isPlaying ? 'red' : 'green'}
                    />
                  </Tooltip>
                </HStack>
              </HStack>
              <HStack spacing={4} align="center">
                <TriangleDownIcon />
                <Slider
                  value={volume}
                  onChange={setVolume}
                  min={0}
                  max={100}
                  flex="1"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Text fontWeight="semibold" minWidth="40px" textAlign="right">
                  {volume}%
                </Text>
              </HStack>
            </VStack>
          </Box>
        )}
        <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={3}>
          {audioData.map((track) => (
            <GridItem
              key={track.audio_id}
              bg={
                selectedMusic?.audio_id === track.audio_id
                  ? selectedBgColor
                  : 'transparent'
              }
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              p={2}
              cursor="pointer"
              onClick={() => handleMusicClick(track)}
              _hover={{ bg: hoverBgColor }}
              transition="all 0.2s"
            >
              <VStack spacing={2}>
                <Text fontSize="xl">🎵</Text>
                <Text fontSize="sm" fontWeight="medium">
                  {track.audio_name}
                </Text>
              </VStack>
            </GridItem>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default MusicPanel;