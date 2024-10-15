import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Flex, VStack, HStack, Heading, Text, Button, useColorModeValue,
  AspectRatio, Tag, Wrap, WrapItem, Icon, Tooltip, useDisclosure,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  Spinner, Avatar, Badge, SimpleGrid, useMediaQuery, Input, FormControl, FormLabel, Textarea, DrawerFooter
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaEdit, FaYoutube, FaTiktok, FaInstagram, FaClock, FaHSquare, FaPaintBrush } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import BottomTabBar from '../components/BottomTabBar';
import { debounce } from 'lodash';

const MotionBox = motion(Box);

const MetadataItem = ({ icon, label, value }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const labelColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <HStack spacing={2} alignItems="center" bg={bgColor} p={2} borderRadius="md">
      <Icon as={icon} color="purple.500" boxSize={5} />
      <VStack align="start" spacing={0}>
        <Text fontSize="xs" fontWeight="medium" color={labelColor}>{label}</Text>
        <Text fontSize="sm" fontWeight="bold" color={textColor}>{value}</Text>
      </VStack>
    </HStack>
  );
};

const PlatformButton = ({ icon: IconComponent, label, onClick, isScheduled }) => (
  <Tooltip label={isScheduled ? `Scheduled for ${new Date(isScheduled).toLocaleString()}` : `Schedule for ${label}`}>
    <Button
      leftIcon={<IconComponent />}
      onClick={onClick}
      colorScheme={isScheduled ? "purple" : "gray"}
      size="sm"
      variant={isScheduled ? "solid" : "outline"}
      borderRadius="full"
    >
      {label}
    </Button>
  </Tooltip>
);

const VoiceCard = ({ name, gender }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const genderColor = gender.toLowerCase() === 'male' ? 'blue.500' : 'pink.500';

  return (
    <Box bg={bgColor} p={4} borderRadius="lg" boxShadow="md" width="full">
      <Flex align="center">
        <Avatar name={name} size="md" mr={4} />
        <Box>
          <Text fontWeight="bold" fontSize="lg" color={textColor}>{name}</Text>
          <Badge colorScheme={gender.toLowerCase() === 'male' ? 'blue' : 'pink'}>
            {gender}
          </Badge>
        </Box>
      </Flex>
    </Box>
  );
};

function GeneratedVideo() {
  const { videoId } = useParams();
  const location = useLocation();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [videoDetails, setVideoDetails] = useState(location.state?.videoDetails || {});
  const [scenes, setScenes] = useState([]);
  const [script, setScript] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState(null);
  const [isLoading, setIsLoading] = useState(!location.state?.videoDetails);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const scriptBgColor = useColorModeValue('gray.50', 'gray.800');
  const scriptTextColor = useColorModeValue('gray.800', 'gray.100');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://api.clipzy.ai/video/all-details/${videoId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setVideoDetails(response.data.video);
        setEditedTitle(response.data.video.title || '');
        setEditedDescription(response.data.video.description || '');
        
        // Get unique scenes based on their IDs
        const uniqueScenes = getUniqueScenes(response.data.scenes);
        setScenes(uniqueScenes);
        setCategory(response.data.script.category || 'N/A');

        // Generate script from the first half of unique scenes
        const halfLength = Math.ceil(uniqueScenes.length / 2);
        const scriptScenes = uniqueScenes.slice(0, halfLength);
        const combinedScript = scriptScenes
          .map(scene => scene.caption)
          .join(' ');
        setScript(combinedScript);

        // Set duration based on the end time of the last unique scene
        if (uniqueScenes.length > 0) {
          const lastScene = uniqueScenes[uniqueScenes.length - 1];
          setDuration(lastScene.end_time);
        }

      } catch (error) {
        console.error('Error fetching video details:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  // Function to get unique scenes based on their IDs
  const getUniqueScenes = (scenes) => {
    const uniqueScenesMap = new Map();
    scenes.forEach(scene => {
      if (!uniqueScenesMap.has(scene.id)) {
        uniqueScenesMap.set(scene.id, scene);
      }
    });
    return Array.from(uniqueScenesMap.values());
  };

  const handleSchedule = (platform) => {
    setVideoDetails(prevDetails => ({
      ...prevDetails,
      scheduledPlatforms: {
        ...prevDetails.scheduledPlatforms,
        [platform]: new Date().toISOString()
      }
    }));
  };

  const handleEditVideo = () => {
    navigate(`/timeline/${videoId}`);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`http://ec2-16-171-74-25.eu-north-1.compute.amazonaws.com:8081/project/edit?id=${videoId}`, {
        title: editedTitle,
        description: editedDescription
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        setVideoDetails(prevDetails => ({
          ...prevDetails,
          title: editedTitle,
          description: editedDescription
        }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating video details:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleTitleUpdate = debounce(async (newTitle) => {
    try {
      const response = await axios.put(`http://ec2-16-171-74-25.eu-north-1.compute.amazonaws.com:8081/project/edit?id=${videoId}`, {
        title: newTitle,
        description: videoDetails.description
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.status === 200) {
        setVideoDetails(prevDetails => ({
          ...prevDetails,
          title: newTitle
        }));
      }
    } catch (error) {
      console.error('Error updating video title:', error);
      // Handle error (e.g., show error message to user)
    }
  }, 500);

  return (
    <Flex flexDirection="column" minHeight="100vh" bg={bgColor}>
      <Flex flex={1}>
        {!isMobile && <Sidebar />}
        <Box flex={1} py={8} px={4}>
          <VStack spacing={8} align="stretch" maxW="1200px" mx="auto">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              bg={cardBgColor}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="xl"
            >
              <Flex direction={{ base: 'column', md: 'row' }} align="start">
                <Box width={{ base: '100%', md: '50%' }} p={6}>
                  <AspectRatio ratio={9 / 16} width="100%" height={{ base: 'auto', md: '100%' }}>
                    {isLoading ? (
                      <Flex justify="center" align="center">
                        <Spinner size="xl" color={accentColor} />
                      </Flex>
                    ) : (
                      <video
                        src={videoDetails.filePath}
                        controls
                        style={{ objectFit: 'cover', borderRadius: '12px', width: '100%', height: '100%' }}
                      />
                    )}
                  </AspectRatio>
                </Box>
                <VStack flex={1} align="stretch" p={6} spacing={6}>
                  <Flex justify="space-between" align="center" width="100%">
                    <VStack align="start" spacing={2} flex={1}>
                      <Input
                        value={editedTitle}
                        onChange={(e) => {
                          setEditedTitle(e.target.value);
                          handleTitleUpdate(e.target.value);
                        }}
                        placeholder="Enter title"
                        size="md"
                        fontWeight="bold"
                        variant="flushed"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                        color={textColor}
                        borderColor={useColorModeValue("gray.300", "gray.600")}
                        maxWidth="300px"
                      />
                    </VStack>
                    <Button leftIcon={<FaEdit />} onClick={handleEditVideo} size="sm" colorScheme="purple">
                      Edit Video
                    </Button>
                  </Flex>

                  <Box bg={scriptBgColor} p={4} borderRadius="md" boxShadow="sm">
                    <Heading size="sm" color={textColor} mb={2}>Script Preview</Heading>
                    <Text fontSize="sm" color={scriptTextColor} whiteSpace="pre-wrap">
                      {script || "No script available."}
                    </Text>
                  </Box>

                  <VoiceCard 
                    name={videoDetails.voiceName || "N/A"} 
                    gender={videoDetails.voiceGender || "N/A"}
                  />

                  <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                    <MetadataItem icon={FaClock} label="Duration" value={`${duration || 'N/A'} seconds`} />
                    <MetadataItem icon={FaHSquare} label="Category" value={category} />
                    <MetadataItem icon={FaPaintBrush} label="Art Style" value={videoDetails.artStyle || "N/A"} />
                  </SimpleGrid>

                  <VStack align="stretch" spacing={2}>
                    <Heading size="sm" color={textColor}>Schedule Post</Heading>
                    <HStack spacing={2}>
                      <PlatformButton
                        icon={FaYoutube}
                        label="YouTube"
                        onClick={() => handleSchedule('youtube')}
                        isScheduled={videoDetails.scheduledPlatforms?.youtube}
                      />
                      <PlatformButton
                        icon={FaTiktok}
                        label="TikTok"
                        onClick={() => handleSchedule('tiktok')}
                        isScheduled={videoDetails.scheduledPlatforms?.tiktok}
                      />
                      <PlatformButton
                        icon={FaInstagram}
                        label="Instagram"
                        onClick={() => handleSchedule('instagram')}
                        isScheduled={videoDetails.scheduledPlatforms?.instagram}
                      />
                    </HStack>
                  </VStack>

                  <Wrap>
                    {videoDetails.tags && videoDetails.tags.map((tag, index) => (
                      <WrapItem key={index}>
                        <Tag size="sm" colorScheme="purple" borderRadius="full">{tag}</Tag>
                      </WrapItem>
                    ))}
                  </Wrap>

                </VStack>
              </Flex>
            </MotionBox>
          </VStack>
        </Box>
      </Flex>
      {isMobile && <BottomTabBar />}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent bg={cardBgColor} color={textColor}>
          <DrawerCloseButton />
          <DrawerHeader>Edit Video Details</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
              </FormControl>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleEditSubmit}>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default GeneratedVideo;
