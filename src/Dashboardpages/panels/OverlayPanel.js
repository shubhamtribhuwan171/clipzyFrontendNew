import React, { useState, useCallback } from 'react';
import { Box, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Select, Grid, GridItem, VStack, HStack, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';

const overlays = [
  { name: 'Bokeh Particles', icon: '🌟' },
  { name: 'Broken Light Leak', icon: '💡' },
  { name: 'Damaged Film', icon: '🎞️' },
  { name: 'Flickering Film', icon: '📽️' },
  { name: 'Glitter', icon: '✨' },
  { name: 'Multicolor Light Leak', icon: '🌈' },
  { name: 'Retro Glitch', icon: '👾' },
  { name: 'White Dots', icon: '⚪' },
];

const blendingModes = [
  { value: 'normal', label: 'Normal (recommended)' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' },
];

const OverlayPanel = () => {
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [opacity, setOpacity] = useState(50);
  const [blendingMode, setBlendingMode] = useState('normal');

  const handleOverlayClick = useCallback((overlay) => {
    setSelectedOverlay(prevSelected => prevSelected?.name === overlay.name ? null : overlay);
  }, []);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const selectedBgColor = useColorModeValue("blue.100", "blue.700");

  return (
    <Box bg={bgColor} p={4} height="100%" borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Overlay Effects</Text>
        {selectedOverlay && (
          <Box borderWidth={1} borderColor={borderColor} p={4} borderRadius="md">
            <VStack spacing={3} align="stretch">
              <Text fontSize="lg" fontWeight="semibold">{selectedOverlay.icon} {selectedOverlay.name}</Text>
              <HStack spacing={4} align="center">
                <Text fontWeight="medium" minWidth="80px">Opacity</Text>
                <Slider value={opacity} onChange={setOpacity} min={0} max={100} flex="1">
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Text fontWeight="semibold" minWidth="40px" textAlign="right">{opacity}%</Text>
              </HStack>
              <HStack spacing={4} align="center">
                <Text fontWeight="medium" minWidth="80px">Blending Mode</Text>
                <Select value={blendingMode} onChange={(e) => setBlendingMode(e.target.value)} size="sm">
                  {blendingModes.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </Select>
              </HStack>
            </VStack>
          </Box>
        )}
        <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={3}>
          {overlays.map((overlay) => (
            <GridItem
              key={overlay.name}
              bg={selectedOverlay?.name === overlay.name ? selectedBgColor : "transparent"}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              p={2}
              cursor="pointer"
              onClick={() => handleOverlayClick(overlay)}
              _hover={{ bg: hoverBgColor }}
              transition="all 0.2s"
            >
              <HStack spacing={2} justifyContent="space-between">
                <HStack>
                  <Text fontSize="xl">{overlay.icon}</Text>
                  <Text fontSize="sm" fontWeight="medium">{overlay.name}</Text>
                </HStack>
                <Tooltip label="Preview">
                  <ViewIcon />
                </Tooltip>
              </HStack>
            </GridItem>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default OverlayPanel;