import React, { useState, useRef } from 'react';
import { Box, Text, Button, Tag, HStack, VStack, useColorModeValue, Tooltip, SimpleGrid, AspectRatio, Image } from '@chakra-ui/react';
import { FaPlay, FaPause, FaInfoCircle } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';

const VideoBackgroundSelector = ({ selectedBackground, onBackgroundChange }) => {
    const backgrounds = [
        { id: 'ai', name: 'AI Generated', image: '/images/ai-generated.jpg' },
        { id: 'minecraft-parkour', name: 'Minecraft Parkour', image: '/images/minecraft-parkour.jpg' },
        { id: 'minecraft-night', name: 'Minecraft Night', image: '/images/minecraft-night.jpg' },
        { id: 'gta5-ramp', name: 'GTA5 Mega Ramp', image: '/images/gta5-mega-ramp.jpg' },
        { id: 'subway-surfer', name: 'Subway Surfer', image: '/images/subway-surfer.jpg' },
        { id: 'satisfying', name: 'Satisfying', image: '/images/satisfying.jpg' },
        { id: 'spooky-woods', name: 'Spooky (Woods)', image: '/images/spooky-woods.jpg' },
        { id: 'luxury', name: 'Luxury', image: '/images/luxury.jpg' },
        { id: 'ominous-space', name: 'Ominous (Space)', image: '/images/ominous-space.jpg' },
        { id: 'peaceful', name: 'Peaceful', image: '/images/peaceful.jpg' },
        { id: 'scary-skulls', name: 'Scary (Skulls)', image: '/images/scary-skulls.jpg' },
        { id: 'nature', name: 'Nature', image: '/images/nature.jpg' },
    ];

    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorder = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.800', 'white');
    const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');

    return (
        <SimpleGrid columns={[2, 3, 4, 6]} spacing={4}>
            {backgrounds.map((bg) => (
                <Box
                    key={bg.id}
                    bg={cardBg}
                    borderWidth="2px"
                    borderColor={bg.id === selectedBackground ? selectedBorderColor : cardBorder}
                    borderRadius="lg"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => onBackgroundChange(bg.id)}
                    position="relative"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                >
                    <AspectRatio ratio={9 / 16}>
                        <Image src={bg.image} alt={bg.name} objectFit="cover" />
                    </AspectRatio>
                    <Box p={1}>
                        <Text fontSize="xs" fontWeight="medium" color={textColor} noOfLines={1}>
                            {bg.name}
                        </Text>
                    </Box>
                    {bg.id === selectedBackground && (
                        <Box
                            position="absolute"
                            top={2}
                            right={2}
                            bg="blue.500"
                            color="white"
                            borderRadius="full"
                            p={1}
                        >
                            <FiCheck size={12} />
                        </Box>
                    )}
                </Box>
            ))}
        </SimpleGrid>
    );
};

export default VideoBackgroundSelector;