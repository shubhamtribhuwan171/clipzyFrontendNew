import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box, SimpleGrid, Icon, useColorModeValue, Input, Select, Flex,
  AspectRatio, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalBody, ModalCloseButton, Tag, Wrap, WrapItem, Container, Heading,
  InputGroup, InputLeftElement, Text, VStack, Spinner
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionText = motion(Text);

const loadingCopies = [
  "Unleashing creativity, one frame at a time...",
  "Brewing a pot of inspiration just for you...",
  "Polishing pixels to perfection...",
  "Curating a world of visual wonders...",
  "Igniting sparks of imagination...",
  "Weaving digital dreams into reality...",
  "Crafting stories that captivate and inspire...",
  "Unlocking a universe of creative potential...",
  "Painting the canvas of possibility...",
  "Sculpting ideas into visual masterpieces...",
  "Channeling the muses of digital artistry...",
  "Forging the future of visual storytelling...",
  "Illuminating the path to creative brilliance...",
  "Breathing life into pixels and dreams...",
  "Orchestrating a symphony of visual delights..."
];

function VideoCard({ video, onClick }) {
  const cardBgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <MotionBox
      bg={cardBgColor}
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <AspectRatio ratio={9/16}>
        <video
          src={video.videoUrl}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
          muted
          loop
          playsInline
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => {
            e.target.pause();
            e.target.currentTime = 0;
          }}
        />
      </AspectRatio>
      <Box p={4}>
        <Heading size="md" noOfLines={1}>{video.title}</Heading>
        <Text fontSize="sm" noOfLines={2} mt={2}>
          {video.description}
        </Text>
      </Box>
    </MotionBox>
  );
}

function StylishModal({ isOpen, onClose, video }) {
  const modalBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg={modalBgColor} overflow="hidden" borderRadius="2xl">
        <ModalCloseButton size="lg" color={textColor} />
        <ModalBody p={0}>
          <Flex direction={{ base: 'column', md: 'row' }} alignItems="center">
            <Box flex={1} p={8}>
              <AspectRatio ratio={9/16} maxW="360px" mx="auto">
                <video
                  src={video?.videoUrl}
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
              <Heading size="xl" mb={4} color={textColor}>{video?.title}</Heading>
              <Text fontSize="lg" color={textColor} mb={4}>{video?.description}</Text>
              <Wrap spacing={2}>
                {video?.tags.map((tag, index) => (
                  <WrapItem key={index}>
                    <Tag colorScheme="blue">{tag}</Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const ExplorePage = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loadingCopy, setLoadingCopy] = useState(loadingCopies[0]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const fetchVideos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const videoIds = [1, 2, 3];
      const fetchedVideos = await Promise.all(
        videoIds.map(async (id) => {
          const response = await axios.get(
            `https://api.clipzy.ai/video/downloadFile/${id}`,
            {
              headers: { 'Authorization': `Bearer ${token}` },
              responseType: 'blob'
            }
          );
          const videoUrl = URL.createObjectURL(response.data);
          return {
            id,
            videoUrl,
            title: `Inspiring Video ${id}`,
            description: `Discover the magic of creativity in this captivating short video.`,
            category: ['Inspiration', 'Creativity', 'Innovation'][Math.floor(Math.random() * 3)],
            tags: ['creative', 'inspiring', 'innovative', 'thoughtful', 'engaging'].sort(() => 0.5 - Math.random()).slice(0, 3)
          };
        })
      );
      // Duplicate videos to have more content
      setVideos([...fetchedVideos, ...fetchedVideos, ...fetchedVideos]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
    // Change loading copy every 3 seconds
    const interval = setInterval(() => {
      setLoadingCopy(loadingCopies[Math.floor(Math.random() * loadingCopies.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchVideos]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    onOpen();
  };

  const filteredVideos = videos.filter(video => 
    (selectedCategory === 'All' || video.category === selectedCategory) &&
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box bg={bgColor} py={4} mb={4}>
        <Container maxW="container.xl">
          <Flex
            gap={4}
            flexDirection={{ base: 'column', sm: 'row' }}
            width="100%"
          >
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Subscribe to start creating..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
              />
            </InputGroup>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              width={{ base: 'full', sm: '200px' }}
              icon={<FaFilter />}
            >
              <option value="All">All Categories</option>
              <option value="Inspiration">Inspiration</option>
              <option value="Creativity">Creativity</option>
              <option value="Innovation">Innovation</option>
            </Select>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl">
        {loading ? (
          <VStack spacing={8} align="center" justify="center" height="50vh">
            <Spinner size="xl" color={accentColor} />
            <AnimatePresence mode="wait">
              <MotionText
                key={loadingCopy}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                fontSize="xl"
                fontWeight="bold"
                textAlign="center"
              >
                {loadingCopy}
              </MotionText>
            </AnimatePresence>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredVideos.map((video, index) => (
              <VideoCard key={`${video.id}-${index}`} video={video} onClick={() => handleVideoClick(video)} />
            ))}
          </SimpleGrid>
        )}
      </Container>

      <StylishModal isOpen={isOpen} onClose={onClose} video={selectedVideo} />
    </Box>
  );
};

export default ExplorePage;