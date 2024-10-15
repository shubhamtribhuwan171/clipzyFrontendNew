import React, { useCallback, useState } from 'react';
import { Box, Flex, VStack, Heading, Button, useColorModeValue, Text, useMediaQuery, IconButton } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { useSwipeable } from 'react-swipeable';
import { useVideoCreation } from '../hooks/useVideoCreation';
import TopicStep from './Videocreation/steps/TopicStep';
import BackgroundStep from './Videocreation/steps/BackgroundStep';
import VisualStyleStep from './Videocreation/steps/VisualStyleStep';
import VoiceStep from './Videocreation/steps/VoiceStep';
import CaptionStep from './Videocreation/steps/CaptionStep';
import LoadingScreen from './Videocreation/steps/LoadingScreen';
import CompletionScreen from './Videocreation/steps/CompletionScreen';
import ErrorMessage from './Videocreation/steps/ErrorMessage';
import StepperComponent from './Videocreation/steps/StepperComponent';
import Sidebar from './Sidebar';
import BottomTabBar from './BottomTabBar';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

// Add this new component for the gradient card
const GradientCard = ({ step, totalSteps }) => {
  const gradients = [
    'radial-gradient(circle at 30% 107%, #667EEA 0%, #764BA2 5%, #6B8DD6 45%, #8E37D7 60%, #B721FF 90%)',
    'radial-gradient(circle at 30% 107%, #FF6B6B 0%, #FCA5A5 25%, #FCD34D 50%, #4ADE80 75%, #60A5FA 100%)',
    'radial-gradient(circle at 30% 107%, #60A5FA 0%, #3B82F6 25%, #8B5CF6 50%, #EC4899 75%, #F43F5E 100%)',
    'radial-gradient(circle at 30% 107%, #14B8A6 0%, #0EA5E9 25%, #8B5CF6 50%, #D946EF 75%, #F43F5E 100%)',
    'radial-gradient(circle at 30% 107%, #FF4500 0%, #FF8717 5%, #FF4500 45%, #FFA500 60%, #FF8C00 90%)',
  ];

  return (
    <Box
      bg={gradients[step % gradients.length]}
      borderRadius="lg"
      p={4}
      color="white"
      textAlign="center"
    >
      <Heading size="md" mb={2}>Step {step + 1} of {totalSteps}</Heading>
      <Text fontSize="sm">{totalSteps - step - 1} steps remaining</Text>
    </Box>
  );
};

function VideoCreationFlow({ onVideoGenerated }) {
    const navigate = useNavigate();

    const {
        activeStep,
        selectedBackground,
        selectedVoice,
        selectedCaptionTemplate,
        isGenerating,
        generationComplete,
        error,
        formData,
        setFormData,
        handleNext,
        handleBack,
        handleSubmit,
        getSteps,
        setSelectedBackground,
        setSelectedVoice,
        setSelectedCaptionTemplate,
    } = useVideoCreation(onVideoGenerated, () => {
        // This callback will be called when video creation is complete
        navigate('/dashboard/videos');
    });

    const steps = getSteps();

    const bgColor = useColorModeValue('gray.50', '#121212');
    const textColor = useColorModeValue('gray.800', 'white');

    const [isMobile] = useMediaQuery("(max-width: 768px)");
    const bottomBarBg = useColorModeValue('white', 'gray.800');

    const [isInteractingWithCarousel, setIsInteractingWithCarousel] = useState(false);

    // Swipe handlers
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            if (isMobile && activeStep < steps.length - 1 && !isInteractingWithCarousel) {
                handleNextWithLog();
            }
        },
        onSwipedRight: () => {
            if (isMobile && activeStep > 0 && !isInteractingWithCarousel) {
                handleBack();
            }
        },
        preventDefaultTouchmoveEvent: !isInteractingWithCarousel,
        trackMouse: true
    });

    const handleNextWithLog = () => {
        console.log('TopicStep data:', formData);
        console.log('BackgroundStep data:', selectedBackground);

        if (activeStep === 0) {
            // Topic step
            console.log('TopicStep data:', formData);
        } else if (activeStep === 1) {
            // Background step
            console.log('BackgroundStep data:', selectedBackground);
        } else if (activeStep === 2) {
            if (selectedBackground === 'ai') {
                console.log('VisualStyleStep data:', formData.imageStyle);
            } else {
                console.log('VoiceStep data:', selectedVoice);
            }
        } else if (activeStep === 3) {
            if (selectedBackground === 'ai') {
                console.log('VoiceStep data:', selectedVoice);
            } else {
                console.log('CaptionStep data:', selectedCaptionTemplate);
            }
        } else if (activeStep === 4) {
            console.log('CaptionStep data:', selectedCaptionTemplate);
        }

        handleNext();
    };

    const handleSubmitWithLog = () => {
        // console.log('TopicStep data:', formData);
        // console.log('BackgroundStep data:', selectedBackground);
        // console.log('VoiceStep data:', selectedVoice);
        // console.log('CaptionStep data:', selectedCaptionTemplate);
        handleSubmit();
    };

    const renderStep = useCallback(() => {
        switch (activeStep) {
            case 0:
                return <TopicStep 
                  formData={formData} 
                  setFormData={setFormData} 
                  setIsInteractingWithCarousel={setIsInteractingWithCarousel}
                />;
            case 1:
                return <BackgroundStep 
                    selectedBackground={selectedBackground} 
                    setSelectedBackground={setSelectedBackground} 
                    setIsInteractingWithCarousel={setIsInteractingWithCarousel}
                />;
            case 2:
                if (selectedBackground === 'ai') {
                    return <VisualStyleStep 
                        formData={formData} 
                        setFormData={setFormData} 
                        setIsInteractingWithCarousel={setIsInteractingWithCarousel}
                    />;
                } else {
                    return <VoiceStep selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} />;
                }
            case 3:
                if (selectedBackground === 'ai') {
                    return <VoiceStep selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} />;
                } else {
                    return <CaptionStep selectedCaptionTemplate={selectedCaptionTemplate} setSelectedCaptionTemplate={setSelectedCaptionTemplate} />;
                }
            case 4:
                return <CaptionStep selectedCaptionTemplate={selectedCaptionTemplate} setSelectedCaptionTemplate={setSelectedCaptionTemplate} />;
            default:
                return null;
        }
    }, [activeStep, selectedBackground, formData, setFormData, selectedVoice, setSelectedVoice, selectedCaptionTemplate, setSelectedCaptionTemplate, setIsInteractingWithCarousel]);

    const buttonBg = useColorModeValue('white', 'gray.700');
    const buttonColor = useColorModeValue('gray.800', 'white');

    const NavigationButtons = () => (
        <Flex justifyContent="space-between" width="100%" mt={4}>
            {activeStep > 0 && (
                <Button 
                    onClick={handleBack} 
                    leftIcon={<FiChevronLeft />} 
                    bg={buttonBg} 
                    color={buttonColor}
                >
                    Back
                </Button>
            )}
            {activeStep < steps.length - 1 ? (
                <Button 
                    onClick={handleNextWithLog} 
                    rightIcon={<FiChevronRight />} 
                    bg={buttonBg} 
                    color={buttonColor} 
                    ml="auto"
                >
                    Next
                </Button>
            ) : (
                <Button 
                    onClick={handleSubmitWithLog} 
                    rightIcon={<FiCheck />} 
                    colorScheme="green" 
                    ml="auto"
                >
                    Generate Video
                </Button>
            )}
        </Flex>
    );

    if (isGenerating) return <LoadingScreen />;
    if (generationComplete) {
        // Remove the CompletionScreen and let the navigation handle the redirection
        return null;
    }

    return (
        <Flex flexDirection="column" height="100vh">
            <Flex flex={1} overflow="hidden">
                {!isMobile && <Sidebar />}
                <Box 
                    {...swipeHandlers}
                    flex={1} 
                    display="flex" 
                    flexDirection="column" 
                    bg={bgColor} 
                    overflowY="auto" 
                    pb={isMobile ? 40 : 8}
                >
                    <Box p={4} position="relative">
                        <VStack spacing={8} align="stretch" maxW={isMobile ? "100%" : "1200px"} mx="auto">
                            {!isMobile && (
                                <>
                                    <Heading size={isMobile ? "lg" : "xl"} textAlign="center">Create Your Video</Heading>
                                    <StepperComponent steps={steps} activeStep={activeStep} />
                                </>
                            )}
                            {isMobile && (
                                <GradientCard step={activeStep} totalSteps={steps.length} />
                            )}
                            {error && <ErrorMessage message={error} />}
                            <AnimatePresence mode="wait">
                                <MotionBox
                                    key={activeStep}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderStep()}
                                </MotionBox>
                            </AnimatePresence>
                            {!isMobile && <NavigationButtons />}
                        </VStack>
                    </Box>
                </Box>
            </Flex>
            {isMobile && (
                <>
                    <Box
                        position="fixed"
                        bottom={16}
                        left={0}
                        right={0}
                        bg={bottomBarBg}
                        boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
                        p={4}
                        zIndex={10}
                    >
                        <NavigationButtons />
                    </Box>
                    <Box position="fixed" bottom={0} left={0} right={0} zIndex={9}>
                        <BottomTabBar />
                    </Box>
                </>
            )}
        </Flex>
    );
}

export default VideoCreationFlow;