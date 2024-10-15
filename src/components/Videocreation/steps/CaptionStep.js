import React, { useState } from 'react';
import { VStack, Heading, Text, SimpleGrid, Box, Button, Flex, useMediaQuery } from '@chakra-ui/react';
import CaptionStylePreview from '../CaptionStylePreview';
import CaptionPreviewCard from '../CaptionPreviewCard';
import captionStyles from '../caption_style.json';
import wordTimings from '../word_timings.json';

const CaptionStep = () => {
    const [selectedCaptionTemplates, setSelectedCaptionTemplates] = useState([]);
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

    const handleCaptionTemplateChange = (templateName) => {
        setSelectedCaptionTemplates((prevSelected) => {
            if (prevSelected.includes(templateName)) {
                return prevSelected.filter(name => name !== templateName);
            } else {
                if (prevSelected.length < 2) {
                    return [...prevSelected, templateName];
                } else {
                    alert('You can select up to two caption styles.');
                    return prevSelected;
                }
            }
        });
    };

    const clearSelection = () => {
        setSelectedCaptionTemplates([]);
    };

    // Only use the first two lines of word timings for the preview
    const previewWordTimings = wordTimings.slice(0, 2);

    return (
        <VStack spacing={6} align="stretch" w="100%" maxW="1200px" mx="auto" px={4}>
            <Heading size="lg">Caption Settings</Heading>
            <Text>Select up to two caption styles for your video</Text>
            <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                {Object.keys(captionStyles).map((styleName) => (
                    <CaptionStylePreview
                        key={styleName}
                        styleName={styleName}
                        isSelected={selectedCaptionTemplates.includes(styleName)}
                        onSelect={() => handleCaptionTemplateChange(styleName)}
                        label={styleName}
                    />
                ))}
            </SimpleGrid>
            {selectedCaptionTemplates.length > 0 && (
                <Box mt={4}>
                    <Text fontWeight="bold" mb={2}>Selected Styles:</Text>
                    <Flex direction={isLargerThan768 ? "row" : "column"} gap={4}>
                        {selectedCaptionTemplates.map((templateName) => (
                            <Box key={templateName} flex={1} maxW={isLargerThan768 ? "50%" : "100%"}>
                                <Text mb={2}>{templateName}</Text>
                                <CaptionPreviewCard
                                    captionStyle={captionStyles[templateName]}
                                    wordTimings={previewWordTimings}
                                />
                            </Box>
                        ))}
                    </Flex>
                    <Button mt={4} colorScheme="blue" onClick={clearSelection}>
                        Clear Selection
                    </Button>
                </Box>
            )}
        </VStack>
    );
};

export default CaptionStep;