import React, { useEffect, useState } from 'react';
import {
  Box, VStack, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  useColorModeValue, Container, Flex, SimpleGrid, Button, Icon
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaQuestionCircle, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
 
const MotionBox = motion(Box);

function SupportPage() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const [randomImages, setRandomImages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      setUserInfo(JSON.parse(storedUserDetails));
    }

    // Initialize Crisp chat
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "610ce7e7-a905-4154-810c-f8e62819d235";

    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);

    // Hide Crisp chat on load
    const hideCrispOnLoad = () => {
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:hide"]);
      }
    };

    // Set up event listener for chat close
    const handleChatClose = () => {
      setIsChatVisible(false);
      window.$crisp.push(["do", "chat:hide"]);
    };

    if (window.$crisp) {
      hideCrispOnLoad();
    } else {
      document.addEventListener("crisp:ready", hideCrispOnLoad, { once: true });
    }

    // Set up Crisp events
    window.CRISP_READY_TRIGGER = () => {
      window.$crisp.push(["on", "chat:closed", handleChatClose]);
    };

    // Cleanup
    return () => {
      if (window.$crisp) {
        window.$crisp.push(["off", "chat:closed", handleChatClose]);
      }
    };
  }, []);

  const backgroundImages = [
    '/bg/image1.jpg',
    '/bg/image2.jpg',
    '/bg/image3.jpg',
    '/bg/image4.jpg',
    '/bg/image5.jpg',
    '/bg/image6.jpg',
    '/bg/image7.jpg',
    '/bg/image8.jpg',
    '/bg/image9.jpg',
    '/bg/image10.jpg',
    '/bg/image11.jpg',
    '/bg/image12.jpg',
    '/bg/image13.jpg'
  ];

  useEffect(() => {
    const shuffled = [...backgroundImages].sort(() => 0.5 - Math.random());
    setRandomImages(shuffled.slice(0, 6));
  }, []);

  const faqItems = [
    {
      question: "How do I create a new video?",
      answer: "To create a new video, click on the 'Create New Video' button on the Videos page. Follow the step-by-step guide to generate your video."
    },
    {
      question: "Can I edit my videos after creation?",
      answer: "Currently, direct editing of created videos is not supported. However, you can always create a new video with the desired changes."
    },
    {
      question: "How do I schedule my videos for posting?",
      answer: "Navigate to the Schedule page, select the video you want to schedule, and choose the date and platform for posting."
    },
    {
      question: "What file formats are supported for video upload?",
      answer: "We support most common video formats including MP4, MOV, AVI, and WebM. For best results, we recommend using MP4 with H.264 encoding."
    },
    {
      question: "Is there a limit to how many videos I can create?",
      answer: "The number of videos you can create depends on your subscription plan. Check your account settings for details on your current plan and limits."
    }
  ];

  useEffect(() => {
    // Initialize Crisp chat
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "610ce7e7-a905-4154-810c-f8e62819d235";

    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);

    // Set user information when Crisp is loaded
    const setCrispUser = () => {
      if (window.$crisp && userInfo) {
        window.$crisp.push(["set", "user:email", userInfo.email]);
        window.$crisp.push(["set", "user:nickname", userInfo.username]);
      }
    };

    // Check if Crisp is already loaded
    if (window.$crisp) {
      setCrispUser();
    } else {
      // If not, wait for it to load
      document.addEventListener("crisp:ready", setCrispUser, { once: true });
    }

  }, [userInfo]);

  const openCrispChat = () => {
    if (window.$crisp) {
      // Ensure user info is set before opening chat
      if (userInfo) {
        window.$crisp.push(["set", "user:email", userInfo.email]);
        window.$crisp.push(["set", "user:nickname", userInfo.username]);
      }
      window.$crisp.push(["do", "chat:show"]);
      window.$crisp.push(["do", "chat:open"]);
      setIsChatVisible(true);
    }
  };

  return (
    <Box minHeight="100vh" bg={bgColor} py={16}>
      <SimpleGrid columns={[2, 3]} spacing={0} position="absolute" top={0} left={0} right={0} bottom={0}>
        {randomImages.map((image, index) => (
          <Box
            key={index}
            backgroundImage={`url(${image})`}
            backgroundSize="cover"
            backgroundPosition="center"
            filter="blur(6px)"
            transform="scale(1.1)"
            opacity={0.7}
            transition="opacity 0.5s"
          />
        ))}
      </SimpleGrid>
      <Container maxW="container.xl" pt={20} pb={10} position="relative" zIndex={1}>
        <Button
          leftIcon={<FaArrowLeft />}
          onClick={() => navigate(-1)}
          position="absolute"
          top={4}
          left={4}
          colorScheme="purple"
          variant="solid"
        >
          Back
        </Button>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bg={cardBgColor}
          borderRadius="xl"
          p={8}
          boxShadow="xl"
          backdropFilter="blur(10px)"
        >
          <VStack spacing={8} align="stretch">
            <Flex align="center" justify="center">
              <Icon as={FaQuestionCircle} w={10} h={10} color={accentColor} mr={4} />
              <Heading size="2xl" textAlign="center" color={textColor}>
                Support Center
              </Heading>
            </Flex>
            <Text fontSize="xl" textAlign="center" color={secondaryTextColor} fontWeight="medium">
              Find answers to common questions about our AI video creation platform.
            </Text>
            <Accordion allowMultiple>
              <AnimatePresence>
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} border="none" mb={4}>
                    {({ isExpanded }) => (
                      <MotionBox
                        initial={false}
                        animate={{ backgroundColor: isExpanded ? accentColor : 'transparent' }}
                        transition={{ duration: 0.2 }}
                        borderRadius="md"
                        overflow="hidden"
                      >
                        <AccordionButton
                          _expanded={{ bg: accentColor, color: 'white' }}
                          _hover={{ bg: isExpanded ? accentColor : hoverBgColor }}
                          borderRadius="md"
                        >
                          <Box flex="1" textAlign="left" fontWeight="semibold">
                            {item.question}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4} bg={cardBgColor}>
                          <Text color={textColor}>{item.answer}</Text>
                        </AccordionPanel>
                      </MotionBox>
                    )}
                  </AccordionItem>
                ))}
              </AnimatePresence>
            </Accordion>
            <Button
              leftIcon={<Icon as={FaComments} />}
              colorScheme="purple"
              size="lg"
              onClick={openCrispChat}
            >
              Chat with Support
            </Button>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}

export default SupportPage;