import React from 'react';
import { VStack, Heading, SimpleGrid, Box, useMediaQuery } from '@chakra-ui/react';
import VoiceCard from '../VoiceCard';
import { voicesData } from '../../../data/voicesData';

const VoiceStep = ({ selectedVoice, setSelectedVoice }) => {
    const [isMobile] = useMediaQuery("(max-width: 48em)");

    const handleVoiceSelect = (voice) => {
        setSelectedVoice(voice);
    };

    return (
        <VStack spacing={6} align="stretch">
            <Heading size="lg">Select Voice Over</Heading>
            <Box maxHeight="60vh" overflowY="auto" pr={2}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={isMobile ? 2 : 6}>
                    {voicesData.map((voice) => (
                        <VoiceCard
                            key={voice.voice_id}
                            voice={voice}
                            onSelect={() => handleVoiceSelect(voice)}
                            isSelected={selectedVoice && selectedVoice.voice_id === voice.voice_id}
                            isMobile={isMobile}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </VStack>
    );
};

export default VoiceStep;
