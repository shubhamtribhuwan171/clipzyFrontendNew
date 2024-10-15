import React, { useState } from 'react';
import { VStack, Heading, Text, SimpleGrid, Box, Image, useColorModeValue, AspectRatio } from '@chakra-ui/react';

const BackgroundStep = ({ selectedBackground, setSelectedBackground }) => {
    const [showCustomOptions, setShowCustomOptions] = useState(false);
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');

    const backgroundOptions = [
        { id: 'ai', name: 'AI-Generated Visuals', image: '/images/ai-generated.jpg' },
        { id: 'custom', name: 'Custom Background Video', image: '/images/minecraft-night.jpg' },
    ];

    const customBackgroundOptions = [
        { name: 'GTA 5', image: '/images/gta5-mega-ramp.jpg' },
        { name: 'Minecraft', image: '/images/minecraft-parkour.jpg' },
        { name: 'Subway Surfer', image: '/images/subway-surfer.jpg' },
    ];

    const handleBackgroundChange = (bgId) => {
        if (bgId === 'custom') {
            setShowCustomOptions(true);
        } else {
            setSelectedBackground(bgId);
            setShowCustomOptions(false);
        }
    };

    const handleCustomBackgroundSelect = (bgId) => {
        setSelectedBackground(bgId);
    };

    const renderBackgroundOptions = (options, onSelect) => (
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
            {options.map((bg) => (
                <Box
                    key={bg.id || bg.name}
                    borderWidth="2px"
                    borderRadius="lg"
                    borderColor={selectedBackground === (bg.id || bg.name) ? selectedBorderColor : borderColor}
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => onSelect(bg.id || bg.name)}
                    transition="all 0.3s"
                    _hover={{ transform: 'scale(1.05)' }}
                >
                    <AspectRatio ratio={9/16}>
                        <Image src={bg.image} alt={bg.name} objectFit="cover" />
                    </AspectRatio>
                    <Box p={2}>
                        <Text fontWeight="bold" textAlign="center">{bg.name}</Text>
                    </Box>
                </Box>
            ))}
        </SimpleGrid>
    );

    if (showCustomOptions) {
        return (
            <VStack spacing={6} align="stretch">
                <Heading size="lg">Custom Background Videos</Heading>
                <Text>Select a custom background for your video:</Text>
                {renderBackgroundOptions(customBackgroundOptions, handleCustomBackgroundSelect)}
            </VStack>
        );
    }

    return (
        <VStack spacing={6} align="stretch">
            <Heading size="lg">Video Backgrounds</Heading>
            <Text>Select a video background type:</Text>
            {renderBackgroundOptions(backgroundOptions, handleBackgroundChange)}
        </VStack>
    );
};

export default BackgroundStep;
