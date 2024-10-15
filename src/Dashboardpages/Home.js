import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Flex, Heading, Text, Button, SimpleGrid, Icon, useColorModeValue,
  VStack, HStack, Input, InputGroup, InputLeftElement, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Skeleton, AspectRatio, Tag, Wrap, WrapItem, Alert, AlertIcon, AlertTitle, AlertDescription, Image, useBreakpointValue
} from '@chakra-ui/react';
import { FiYoutube, FiVideo, FiTrendingUp, FiZap, FiSearch, FiPlay, FiClock, FiCheck, FiPlus } from 'react-icons/fi';
import { FaCreditCard } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideo } from '../context/VideoContext';
import axios from 'axios';
import { subDays, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';

const MotionBox = motion(Box);
const MotionText = motion(Text);

const inspirationalQuotes = [
  "Creativity is intelligence having fun. - Albert Einstein",
  "The best way to predict the future is to create it. - Peter Drucker",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Creativity is contagious. Pass it on. - Albert Einstein",
  "The secret to getting ahead is getting started. - Mark Twain",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "If you can dream it, you can do it. - Walt Disney",
  "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb"
];

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const useRandomAnimation = () => {
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    const duration = Math.floor(Math.random() * (60 - 30 + 1) + 30); // Random duration between 30-60s
    const delay = Math.floor(Math.random() * 10); // Random delay between 0-10s
    setAnimation(`${gradientShift} ${duration}s ease-in-out ${delay}s infinite`);
  }, []);

  return animation;
};

const shineAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const AnimatedButton = ({ onClick, children }) => {
  return (
    <MotionBox
      as="button"
      position="relative"
      overflow="hidden"
      borderRadius="full"
      bg="purple.800"
      color="white"
      px={6}
      py={3}
      fontWeight="bold"
      _hover={{ bg: "purple.700" }}
      _active={{ bg: "purple.900" }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Box
        position="absolute"
        top="-50%"
        left="-50%"
        right="-50%"
        bottom="-50%"
        bg="linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)"
        style={{ transform: "rotate(45deg)" }}
        animation={`${shineAnimation} 3s infinite`}
      />
      {children}
    </MotionBox>
  );
};

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([
    "DIY Hacks", "Dance Challenges", "Cooking Tips", "Tech Reviews", "Fashion Trends"
  ]);
  const [quote, setQuote] = useState(inspirationalQuotes[0]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [videoStats, setVideoStats] = useState({
    POSTED: 0,
    GENERATED: 0,
    SCHEDULED: 0
  });
  const [tokenInfo, setTokenInfo] = useState(null);
  const [showCreditWarning, setShowCreditWarning] = useState(false);
  const navigate = useNavigate();

  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const alertBgColor = useColorModeValue('red.100', 'red.900');
  const alertTextColor = useColorModeValue('red.800', 'red.200');

  const { fetchVideos } = useVideo();

  const loadVideos = useCallback(async () => {
    setLoading(true);
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (!userDetails) {
      console.error('No user details found');
      setLoading(false);
      return;
    }

    const endDate = new Date();
    const startDate = subDays(endDate, 7); // Fetch videos for the last 7 days

    try {
      const fetchedVideos = await fetchVideos(userDetails.workspaceId, {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      });
      // Sort videos from latest to oldest
      const sortedVideos = fetchedVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchVideos]);

  const fetchVideoStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      if (!token || !userDetails) {
        console.error('No auth token or user details found');
        return;
      }

      const response = await axios.get(
        `https://api.clipzy.ai/video/counts`,
        {
          params: { workspaceId: userDetails.workspaceId },
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setVideoStats(response.data);
    } catch (error) {
      console.error('Error fetching video stats:', error);
    }
  }, []);

  const fetchTokenInfo = async () => {
    try {
      console.log('from home')
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.get(
        'https://api.clipzy.ai/user/token-info',
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      console.log('Token Info:', response.data);
      setTokenInfo(response.data);
    } catch (error) {
      console.error('Error fetching token info:', error);
    }
  };

  useEffect(() => {
    loadVideos();
    fetchVideoStats();
    fetchTokenInfo();
    const interval = setInterval(() => {
      setQuote(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, [loadVideos, fetchVideoStats]);

  const handleVideoClick = (video) => {
    navigate(`/dashboard/generated-video/${video.id}`, { state: { videoDetails: video } });
  };

  
  const handleCreateNewVideo = () => {
    if (tokenInfo && tokenInfo.remainingTokens === 0) {
      setShowCreditWarning(true);
    } else {
      navigate('/dashboard/content-studio'); // Navigate to HomePage.js
    }
  };

  const displayedVideos = useBreakpointValue({ base: 4, md: 3 });

  return (
    <Box minHeight="100vh" bg={bgColor} py={8} pb={{ base: 20, md: 8 }}>
      <VStack spacing={{ base: 4, md: 8 }} align="stretch" maxW="1200px" mx="auto" px={4}>
        {/* Welcome Section */}
        <Flex justifyContent="space-between" alignItems="center" flexDirection={{ base: "column", md: "row" }} gap={4}>
          <VStack align={{ base: "center", md: "start" }} spacing={2}>
            <Heading as="h1" size={{ base: "lg", md: "xl" }} color={textColor}>Welcome back, Creator!</Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color={textColor} textAlign={{ base: "center", md: "left" }}>Ready to make your next viral video?</Text>
          </VStack>
          {/* Hide this button on mobile */}
          <Box display={{ base: "none", md: "block" }}>
            <AnimatedButton onClick={handleCreateNewVideo} size="md">
              <HStack spacing={2}>
                <Icon as={FiVideo} />
                <Text>Create New Video</Text>
              </HStack>
            </AnimatedButton>
          </Box>
        </Flex>

        {/* Credit Warning Alert */}
        <AnimatePresence>
          {showCreditWarning && (
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert status="warning" bg={alertBgColor} color={alertTextColor} borderRadius="md">
                <AlertIcon />
                <Box flex="1">
                  <AlertTitle mr={2} display="flex" alignItems="center" fontSize={{ base: "sm", md: "md" }}>
                    <MotionText
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      display="inline-block"
                      mr={2}
                    >
                      😣
                    </MotionText>
                    Oops! You're out of credits!
                  </AlertTitle>
                  <AlertDescription fontSize={{ base: "xs", md: "sm" }}>You don't have enough credits to generate a new video.</AlertDescription>
                </Box>
                <Button
                  ml="auto"
                  colorScheme="blue"
                  leftIcon={<FaCreditCard />}
                  onClick={() => navigate('/dashboard/subscription-and-credits')}
                  size={{ base: "sm", md: "md" }}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  Add Credits
                </Button>
              </Alert>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <SimpleGrid columns={3} spacing={{ base: 2, md: 6 }}>
          <StatCard 
            icon={FiYoutube} 
            title="Generated Shorts" 
            value={videoStats.GENERATED.toString()} 
            gradient="radial-gradient(circle at 30% 107%, #ff4500 0%, #ff8717 5%, #ff4500 45%, #ffa500 60%, #ff8c00 90%)"
          />
          <StatCard 
            icon={FiTrendingUp} 
            title="Posted Shorts" 
            value={videoStats.POSTED.toString()} 
            gradient="radial-gradient(circle at 30% 107%, #25d366 0%, #128c7e 5%, #075e54 45%, #34b7f1 60%, #00a884 90%)"
          />
          <StatCard 
            icon={FiClock} 
            title="Scheduled Shorts" 
            value={videoStats.SCHEDULED.toString()} 
            gradient="radial-gradient(circle at 30% 107%, #667eea 0%, #764ba2 5%, #6B8DD6 45%, #8E37D7 60%, #B721FF 90%)"
          />
        </SimpleGrid>

        {/* Your Latest Shorts */}
        <Box>
          <Heading size={{ base: "md", md: "lg" }} mb={4} color={textColor}>Your Latest Shorts</Heading>
          {loading ? (
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 2, md: 4 }}>
              {[...Array(displayedVideos)].map((_, index) => (
                <Skeleton key={index} height={{ base: "150px", md: "200px" }} borderRadius="lg" />
              ))}
            </SimpleGrid>
          ) : videos.length > 0 ? (
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 2, md: 4 }}>
              {videos.slice(0, displayedVideos).map(video => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onClick={() => handleVideoClick(video)}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Text fontSize={{ base: "md", md: "lg" }} color={textColor}>No videos yet. Start creating!</Text>
          )}
        </Box>
      </VStack>

      {/* Floating action button for mobile */}
      <Box
        position="fixed"
        bottom="80px"  // Increased from 24px to 80px
        right="24px"
        display={{ base: "block", md: "none" }}
        zIndex={10}
      >
        <AnimatedButton
          onClick={handleCreateNewVideo}
          size="lg"
          borderRadius="full"
          width="56px"
          height="56px"
          bg="purple.500"
          _hover={{ bg: "purple.600" }}
          _active={{ bg: "purple.700" }}
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.3)"
        >
          <Icon as={FiPlus} boxSize={6} />
        </AnimatedButton>
      </Box>

      {/* Video Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent bg={cardBgColor} overflow="hidden" borderRadius="2xl">
          <ModalCloseButton size="lg" color={textColor} />
          <ModalBody p={0}>
            {selectedVideo && (
              <Flex direction={{ base: 'column', md: 'row' }} alignItems="center">
                <Box flex={1} p={8}>
                  <AspectRatio ratio={9/16} maxW="360px" mx="auto">
                    <video
                      src={selectedVideo.videoUrl}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '16px',
                      }}
                      controls
                      autoPlay
                    />
                  </AspectRatio>
                </Box>
                <Box flex={1} p={8}>
                  <Heading size="xl" mb={4} color={textColor}>{selectedVideo.title}</Heading>
                  <Text fontSize="lg" color={textColor}>{selectedVideo.description}</Text>
                </Box>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const StatCard = ({ icon, title, value, gradient }) => {
  const textColor = 'white';
  const animation = useRandomAnimation();

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      p={{ base: 3, md: 5 }}
      shadow="md"
      borderRadius="lg"
      bgImage={gradient}
      backgroundSize="200% 200%"
      animation={animation}
      color={textColor}
    >
      <VStack spacing={{ base: 1, md: 3 }} align="start">
        <Icon as={icon} boxSize={{ base: 4, md: 6 }} />
        <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">
          {value}
        </Text>
        <Text fontSize={{ base: "xs", md: "sm" }}>{title}</Text>
      </VStack>
    </MotionBox>
  );
};

const VideoCard = ({ video, onClick }) => (
  <MotionBox
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
    bg={useColorModeValue('white', '#1E1E1E')}
    borderRadius="lg"
    overflow="hidden"
    boxShadow="md"
    cursor="pointer"
    onClick={onClick}
  >
    <AspectRatio ratio={9/16}>
      <Image
        src={video.thumbnailPath}
        alt={video.title}
        objectFit="cover"
      />
    </AspectRatio>
    <Box p={{ base: 2, md: 3 }}>
      <Heading size={{ base: "xs", md: "sm" }} noOfLines={1} color={useColorModeValue('gray.800', 'gray.100')}>{video.title}</Heading>
      <Text fontSize={{ base: "2xs", md: "xs" }} noOfLines={1} mt={1} color={useColorModeValue('gray.600', 'gray.300')}>
        {video.description}
      </Text>
    </Box>
  </MotionBox>
);
 
  
export default Home;