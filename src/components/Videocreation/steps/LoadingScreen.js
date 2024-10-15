import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, CircularProgress, CircularProgressLabel, Progress } from '@chakra-ui/react';
import { loadingStages, funFacts } from '../../../constants/videoCreationConstants';

const LoadingScreen = () => {
    const [loadingStage, setLoadingStage] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentFact, setCurrentFact] = useState(funFacts[0]);

    useEffect(() => {
        const totalDuration = 60000; // Assume 60 seconds for full generation
        const progressInterval = setInterval(() => {
            setLoadingProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                const increment = 100 / (totalDuration / 1000);
                return Math.min(prevProgress + increment, 100);
            });
        }, 1000);

        const stageInterval = setInterval(() => {
            setLoadingStage((prevStage) => (prevStage + 1) % loadingStages.length);
        }, 10000);

        const factInterval = setInterval(() => {
            setCurrentFact((prevFact) => {
                const newIndex = (funFacts.indexOf(prevFact) + 1) % funFacts.length;
                return funFacts[newIndex];
            });
        }, 8000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stageInterval);
            clearInterval(factInterval);
        };
    }, []);

    return (
        <Box textAlign="center" py={10}>
            <VStack spacing={6}>
                <CircularProgress
                    value={loadingProgress}
                    size="200px"
                    thickness="4px"
                    color={loadingStages[loadingStage].color}
                >
                    <CircularProgressLabel>
                        {Math.round(loadingProgress)}%
                    </CircularProgressLabel>
                </CircularProgress>
                <Box>
                    {React.createElement(loadingStages[loadingStage].icon, { 
                        size: 50, 
                        color: loadingStages[loadingStage].color 
                    })}
                </Box>
                <Heading size="lg" color={loadingStages[loadingStage].color}>
                    {loadingStages[loadingStage].text}
                </Heading>
                <Text fontSize="md" fontStyle="italic">
                    {currentFact}
                </Text>
                <Box w="100%" maxW="600px">
                    <Progress value={loadingProgress} size="sm" colorScheme="blue" />
                </Box>
            </VStack>
        </Box>
    );
};

export default LoadingScreen;