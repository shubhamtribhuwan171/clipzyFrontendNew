import React, { useState } from 'react';
import { Box, VStack, Button, Input, useColorModeValue, Flex, Container, useBreakpointValue } from '@chakra-ui/react';
import { Video, useVideoConfig, useCurrentFrame } from 'remotion';
import { motion } from 'framer-motion';
import Timeline from '../components/Timeline';
import Sidebar from '../components/Sidebar';
import BottomTabBar from '../components/BottomTabBar';

const MotionBox = motion(Box);

const Editor = () => {
    const [videoSrc, setVideoSrc] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const bgColor = useColorModeValue('gray.50', '#121212');
    const cardBgColor = useColorModeValue('white', '#1E1E1E');
    const textColor = useColorModeValue('gray.800', 'gray.300');
    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageSrc(url);
        }
    };

    const handleTimelineChange = (value) => {
        setCurrentTime(value);
    };

    return (
        <Flex minHeight="100vh" bg={bgColor}>
            {!isMobile && <Sidebar />}
            <Box flex={1} overflowY="auto" pb={isMobile ? 16 : 0}>
                <Container maxW="container.xl" py={10}>
                    <VStack spacing={8} align="stretch">
                        <Box display="flex" justifyContent="space-between">
                            <VStack spacing={4}>
                                <Button as="label" colorScheme="blue">
                                    Upload Video
                                    <Input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
                                </Button>
                                <Button as="label" colorScheme="blue">
                                    Upload Image
                                    <Input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                                </Button>
                            </VStack>
                            <Box flex="1" ml={8} bg={cardBgColor} borderRadius="lg" overflow="hidden">
                                {videoSrc && (
                                    <VideoComponent videoSrc={videoSrc} imageSrc={imageSrc} currentTime={currentTime} />
                                )}
                            </Box>
                        </Box>
                        <Box mt={8} bg={cardBgColor} p={4} borderRadius="lg">
                            <Timeline duration={300} currentTime={currentTime} onChange={handleTimelineChange} />
                        </Box>
                    </VStack>
                </Container>
            </Box>
            {isMobile && <BottomTabBar />}
        </Flex>
    );
};

const VideoComponent = ({ videoSrc, imageSrc, currentTime }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    return (
        <MotionBox>
            {videoSrc && <Video src={videoSrc} style={{ width: '100%' }} />}
            {imageSrc && <img src={imageSrc} alt="Uploaded" style={{ width: '100%' }} />}
        </MotionBox>
    );
};

export default Editor;