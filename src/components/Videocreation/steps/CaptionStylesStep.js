import React from 'react';
import { VStack, Heading, Text, Button } from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';

const CaptionStylesStep = () => {
    return (
        <VStack spacing={6} align="stretch">
            <Heading size="lg">Caption Styles</Heading>
            <Text>Customize your caption styles here.</Text>
            {/* Add your caption style customization options here */}
            <Button
                rightIcon={<FiCheck />}
                colorScheme="green"
                onClick={() => console.log('Generate Video clicked')}
            >
                Generate Video
            </Button>
        </VStack>
    );
};

export default CaptionStylesStep;