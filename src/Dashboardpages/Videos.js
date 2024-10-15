import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './dayPickerCustomStyles.css';
import { format, subDays, startOfWeek } from 'date-fns';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Flex,
  SimpleGrid,
  Skeleton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  AspectRatio,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Image,
  Icon,
  HStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Card,
  CardBody,
  PopoverCloseButton
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaChevronDown, FaCreditCard } from 'react-icons/fa';
import { FiVideo } from 'react-icons/fi';
import { keyframes } from '@emotion/react';
import VideoCreationFlow from '../components/VideoCreationFlow';
import { useVideo } from '../context/VideoContext';
import { useNavigate } from 'react-router-dom';
import CustomDatePicker from '../components/CustomDatePicker';

const MotionBox = motion(Box);
const MotionText = motion(Text);

const shineAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const AnimatedButton = ({ onClick, children, icon: IconComponent, noShine = false, ...props }) => {
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
      {...props}
    >
      {!noShine && (
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
      )}
      <HStack spacing={2}>
        {IconComponent && <Icon as={IconComponent} />}
        <Text>{children}</Text>
      </HStack>
    </MotionBox>
  );
};

function VideoCard({ video, onClick }) {
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  return (
    <MotionBox
      bg={cardBgColor}
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      onClick={() => onClick(video)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      boxShadow="md"
      width="100%"
    >
      <AspectRatio ratio={9/16}>
        <Image
          src={video.thumbnailPath}
          alt={video.title}
          objectFit="cover"
        />
      </AspectRatio>
      <Box p={4}>
        <Heading size="md" noOfLines={1} color={textColor}>{video.title}</Heading>
        <Text fontSize="sm" noOfLines={2} mt={2} color={textColor}>
          {video.description}
        </Text>
      </Box>
    </MotionBox>
  );
}

function StylishModal({ isOpen, onClose, video }) {
  const modalBgColor = useColorModeValue('white', '#121212');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay bg="#121212" backdropFilter="blur(10px)" />
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
              <Text fontSize="lg" color={textColor}>{video?.description}</Text>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showCreationFlow, setShowCreationFlow] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dateRange, setDateRange] = useState({ from: startOfWeek(new Date()), to: new Date() });
  const [selectedFilter, setSelectedFilter] = useState('This Week');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [showCreditWarning, setShowCreditWarning] = useState(false);
  const navigate = useNavigate();
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const { fetchVideos } = useVideo();

  const bgColor = useColorModeValue('gray.50', '#121212');
  const drawerBgColor = useColorModeValue('white', '#121212');
  const emptyStateBgColor = useColorModeValue('white', 'gray.800');
  const alertBgColor = useColorModeValue('purple.100', 'purple.900');
  const alertTextColor = useColorModeValue('purple.800', 'purple.200');
  const buttonColorScheme = "purple";
  const textColor = useColorModeValue('gray.600', 'white');

  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isDatePickerOpen, onOpen: onDatePickerOpen, onClose: onDatePickerClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleFilterClick = () => {
    if (isMobile) {
      onFilterOpen();
    }
  };

  const handleDateRangeClick = () => {
    if (isMobile) {
      onDatePickerOpen();
    }
  };

  const loadVideos = useCallback(async () => {
    setLoading(true);
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (!userDetails) {
      console.error('No user details found');
      setLoading(false);
      return;
    }

    const fetchStartDate = format(dateRange.from, 'yyyy-MM-dd');
    const fetchEndDate = format(dateRange.to || dateRange.from, 'yyyy-MM-dd');

    try {
      const response = await axios.get(
        `https://api.clipzy.ai/video/dateRange`,
        {
          params: {
            workspaceId: userDetails.workspaceId,
            startDate: fetchStartDate,
            endDate: fetchEndDate
          },
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );
      // Sort videos from latest to oldest
      const sortedVideos = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadVideos();
    fetchTokenInfo();
  }, [loadVideos]);

  const fetchTokenInfo = async () => {
    try {
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

      setTokenInfo(response.data);
    } catch (error) {
      console.error('Error fetching token info:', error);
    }
  };

  const handleVideoClick = (video) => {
    navigate(`/dashboard/generated-video/${video.id}`, { state: { videoDetails: video } });
  };

  const handleCreateVideo = () => {
    navigate('/dashboard/content-studio');
  };


  const handleDateRangeChange = (newRange) => {
    if (typeof newRange === 'string') {
      setSelectedFilter(newRange);
      switch (newRange) {
        case 'Today':
          setDateRange({ from: new Date(), to: new Date() });
          break;
        case 'Yesterday':
          const yesterday = subDays(new Date(), 1);
          setDateRange({ from: yesterday, to: yesterday });
          break;
        case 'This Week':
          setDateRange({ from: startOfWeek(new Date()), to: new Date() });
          break;
        default:
          break;
      }
    } else {
      setSelectedFilter('Custom Range');
      setDateRange(newRange);
    }
    loadVideos();
  };

  const formatDateRange = (range) => {
    if (!range.from) return 'Select date range';
    if (!range.to) return `${format(range.from, "MMM dd, yyyy")} - Select end date`;
    return `${format(range.from, "MMM dd, yyyy")} - ${format(range.to, "MMM dd, yyyy")}`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={4}>
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} height="200px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      );
    }

    if (videos.length > 0) {
      return (
        <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={4}>
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => handleVideoClick(video)}
            />
          ))}
        </SimpleGrid>
      );
    }

    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg={emptyStateBgColor}
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        textAlign="center"
      >
        <Heading as="h2" size="lg" mb={4}>
          No Videos Found
        </Heading>
        <Text fontSize="xl" mb={6}>
          {selectedFilter === 'Custom Range'
            ? `No videos found for the selected date range (${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}).`
            : `No videos found for ${selectedFilter.toLowerCase()}.`}
        </Text>
        <AnimatedButton
          onClick={handleCreateVideo}
          icon={FiVideo}
          mx="auto"
        >
          Create a New Video
        </AnimatedButton>
      </MotionBox>
    );
  };

  if (showCreationFlow) {
    return <VideoCreationFlow onVideoGenerated={() => {
      setShowCreationFlow(false);
      loadVideos();
    }} />;
  }

  return (
    <Box
      minHeight="100vh"
      bg={bgColor}
      py={8}
      pb={{ base: 20, md: 8 }}
    >
      <VStack spacing={8} align="stretch" maxW="1200px" mx="auto" px={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ base: "stretch", md: "center" }}
          gap={4}
        >
          <VStack align={{ base: "center", md: "start" }} spacing={2}>
            <Heading as="h1" size="xl" color={textColor}>My Videos</Heading>
            <Text fontSize="lg" color={textColor} textAlign={{ base: "center", md: "left" }}>Manage and create your video content</Text>
          </VStack>
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems="center"
            gap={4}
            width={{ base: "100%", md: "auto" }}
          >
            {isMobile ? (
              <AnimatedButton
                onClick={handleCreateVideo}
                icon={FiVideo}
                width="100%"
              >
                Create New Video
              </AnimatedButton>
            ) : (
              <>
                <Popover>
                  <PopoverTrigger>
                    <Button leftIcon={<FaCalendarAlt />} rightIcon={<FaChevronDown />}>
                      {selectedFilter}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent p={0}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <VStack align="stretch" spacing={2}>
                        <Button onClick={() => handleDateRangeChange('Today')}>Today</Button>
                        <Button onClick={() => handleDateRangeChange('Yesterday')}>Yesterday</Button>
                        <Button onClick={() => handleDateRangeChange('This Week')}>This Week</Button>
                        <Button onClick={() => setIsCustomDateOpen(true)}>Custom Range</Button>
                      </VStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                <AnimatedButton
                  onClick={handleCreateVideo}
                  icon={FiVideo}
                >
                  Create New Video
                </AnimatedButton>
              </>
            )}
          </Flex>
        </Flex>

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
                  <AlertTitle mr={2} display="flex" alignItems="center">
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
                  <AlertDescription>You don't have enough credits to generate a new video.</AlertDescription>
                </Box>
                <Button
                  ml="auto"
                  colorScheme={buttonColorScheme}
                  leftIcon={<FaCreditCard />}
                  onClick={() => navigate('/dashboard/subscription-and-credits')}
                >
                  Add Credits
                </Button>
              </Alert>
            </MotionBox>
          )}
        </AnimatePresence>

        {renderContent()}
      </VStack>

      {isMobile && (
        <Box
          position="fixed"
          bottom="140px"
          right="24px"
          zIndex={10}
        >
          <AnimatedButton
            onClick={handleFilterClick}
            size="lg"
            borderRadius="full"
            width="56px"
            height="56px"
            bg="purple.500"
            _hover={{ bg: "purple.600" }}
            _active={{ bg: "purple.700" }}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.3)"
          >
            <Icon as={FaCalendarAlt} boxSize={6} />
          </AnimatedButton>
        </Box>
      )}

      <Drawer
        isOpen={isFilterOpen}
        placement="bottom"
        onClose={onFilterClose}
      >
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px">
          <DrawerCloseButton />
          <DrawerHeader>Select Date Range</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <Button onClick={() => { handleDateRangeChange('Today'); onFilterClose(); }}>Today</Button>
              <Button onClick={() => { handleDateRangeChange('Yesterday'); onFilterClose(); }}>Yesterday</Button>
              <Button onClick={() => { handleDateRangeChange('This Week'); onFilterClose(); }}>This Week</Button>
              <Button onClick={handleDateRangeClick}>Custom Range</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={isDatePickerOpen}
        placement="bottom"
        onClose={onDatePickerClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent bg={drawerBgColor} borderTopRadius="20px">
          <DrawerCloseButton color={textColor} />
          <DrawerHeader color={textColor}>Select Custom Date Range</DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch" py={4}>
              <CustomDatePicker
                dateRange={dateRange}
                onDateChange={(newRange) => {
                  handleDateRangeChange(newRange);
                  onDatePickerClose();
                  onFilterClose();
                }}
              />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isCustomDateOpen} onClose={() => setIsCustomDateOpen(false)} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={6}>
            <VStack spacing={4}>
              <Heading size="md">Select Custom Date Range</Heading>
              <CustomDatePicker
                dateRange={dateRange}
                onDateChange={(newRange) => {
                  handleDateRangeChange(newRange);
                  setIsCustomDateOpen(false);
                }}
              />
              <Button colorScheme="purple" onClick={() => setIsCustomDateOpen(false)} width="100%">
                Apply
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <StylishModal isOpen={isOpen} onClose={onClose} video={selectedVideo} />
    </Box>
  );
}

export default Videos;