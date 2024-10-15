import React, { useState, useEffect, useCallback } from 'react';
import { useVideo } from '../context/VideoContext';
import {
  Box, Flex, Heading, Button, SimpleGrid, useColorModeValue, VStack, HStack,
  Text, useDisclosure, Modal, ModalOverlay, ModalContent, Badge,
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Select,
  FormControl, FormLabel, Input, Popover, PopoverTrigger, PopoverContent,
  PopoverBody, PopoverArrow, PopoverCloseButton, AspectRatio, IconButton,
  Spinner, Image, Tooltip, Tabs, TabList, Tab, TabPanels, TabPanel
} from '@chakra-ui/react';
import { FaCalendarAlt, FaClock, FaEdit, FaTrash, FaYoutube, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format, isWithinInterval, subDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import 'react-day-picker/dist/style.css';

const MotionBox = motion(Box);

const StatusBadge = ({ status }) => {
  let color;
  switch (status) {
    case "Posted":
      color = "green";
      break;
    case "Scheduled":
      color = "yellow";
      break;
    case "Not Scheduled":
      color = "red";
      break;
    default:
      color = "gray";
  }
  return <Badge colorScheme={color}>{status}</Badge>;
};

const VideoCard = ({ video, onSchedule, onEdit, onDelete }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const buttonColorScheme = useColorModeValue('purple', 'purple');

  return (
    <MotionBox
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      position="relative"
      width="100%"
      maxWidth="300px"
      mx="auto"
    >
      <AspectRatio ratio={9 / 16} width="100%">
        <Image
          src={video.thumbnailPath}
          alt={video.title}
          objectFit="cover"
        />
      </AspectRatio>
      <Box position="absolute" top={2} right={2}>
        <Tooltip label={`YouTube: ${video.youtube}`}>
          <StatusBadge status={video.youtube} />
        </Tooltip>
      </Box>
      <Box p={4}>
        <Text fontWeight="bold" fontSize="sm" mb={2} noOfLines={2} color={textColor}>
          {video.title}
        </Text>
        <HStack justify="space-between">
          {video.youtube === "Not Scheduled" && (
            <Button
              leftIcon={<FaYoutube />}
              colorScheme={buttonColorScheme}
              size="sm"
              onClick={() => onSchedule(video)}
              width="100%"
            >
              Schedule
            </Button>
          )}
          {video.youtube === "Scheduled" && (
            <Button
              leftIcon={<FaEdit />}
              colorScheme={buttonColorScheme}
              size="sm"
              onClick={() => onEdit(video)}
              width="100%"
            >
              Edit
            </Button>
          )}
          {video.youtube === "Posted" && (
            <Button
              leftIcon={<FaTrash />}
              colorScheme="red"
              size="sm"
              onClick={() => onDelete(video)}
              width="100%"
            >
              Delete
            </Button>
          )}
        </HStack>
      </Box>
    </MotionBox>
  );
};

const CustomDatePicker = ({ dateRange, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const todayBgColor = useColorModeValue('purple.100', 'purple.900');
  const selectedBgColor = useColorModeValue('purple.500', 'purple.300');
  const hoverBgColor = useColorModeValue('purple.100', 'purple.700');

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const handleDayClick = (day) => {
    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      onDateChange({ from: day, to: undefined });
    } else if (day < dateRange.from) {
      onDateChange({ from: day, to: dateRange.from });
    } else {
      onDateChange({ from: dateRange.from, to: day });
    }
  };

  const isDaySelected = (day) => 
    (dateRange.from && isSameDay(day, dateRange.from)) || 
    (dateRange.to && isSameDay(day, dateRange.to)) ||
    (dateRange.from && dateRange.to && isWithinInterval(day, { start: dateRange.from, end: dateRange.to }));

  return (
    <Box bg={bgColor} p={4} borderRadius="md" boxShadow="md">
      <Flex justify="space-between" align="center" mb={4}>
        <IconButton 
          icon={<FaChevronLeft />} 
          onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
          variant="ghost"
        />
        <Text fontWeight="bold" fontSize="lg" color={textColor}>
          {format(currentMonth, 'MMMM yyyy')}
        </Text>
        <IconButton 
          icon={<FaChevronRight />} 
          onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
          variant="ghost"
        />
      </Flex>
      <SimpleGrid columns={7} spacing={1}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} textAlign="center" fontWeight="bold" fontSize="sm" color={textColor}>
            {day}
          </Text>
        ))}
        {daysInMonth.map(day => (
          <Button
            key={day.toString()}
            size="sm"
            variant="ghost"
            onClick={() => handleDayClick(day)}
            bg={isDaySelected(day) ? selectedBgColor : isToday(day) ? todayBgColor : 'transparent'}
            color={isDaySelected(day) ? 'white' : textColor}
            _hover={{ bg: hoverBgColor }}
            disabled={!isSameMonth(day, currentMonth)}
          >
            {format(day, 'd')}
          </Button>
        ))}
      </SimpleGrid>
    </Box>
  );
};

const SchedulePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: subDays(new Date(), 30), to: new Date() });
  const [schedulingVideo, setSchedulingVideo] = useState(null);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', '#121212');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const modalBg = useColorModeValue('white', 'gray.800');
  const buttonColorScheme = useColorModeValue('purple', 'purple');

  const { fetchVideos } = useVideo();

  const loadVideos = useCallback(async () => {
    setLoading(true);
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (!userDetails) {
      console.error('No user details found');
      setLoading(false);
      return;
    }

    const fetchedVideos = await fetchVideos(userDetails.workspaceId, {
      startDate: format(dateRange.from, 'yyyy-MM-dd'),
      endDate: format(dateRange.to, 'yyyy-MM-dd')
    });

    const statuses = ["Posted", "Scheduled", "Not Scheduled"];
    const videosWithStatus = fetchedVideos.map(video => ({
      ...video,
      youtube: statuses[Math.floor(Math.random() * statuses.length)]
    }));

    setVideos(videosWithStatus);
    setLoading(false);
  }, [fetchVideos, dateRange]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleScheduleVideo = (video) => {
    setSchedulingVideo(video);
    setScheduledDate(null);
    setScheduledTime('');
    onOpen();
  };

  const handleEditSchedule = (video) => {
    setSchedulingVideo(video);
    // Here you would set the existing scheduled date and time
    setScheduledDate(new Date()); // Replace with actual scheduled date
    setScheduledTime('12:00'); // Replace with actual scheduled time
    onOpen();
  };

  const handleDeleteVideo = (video) => {
    // Implement delete logic here
    console.log("Deleting video", video);
  };

  const handleConfirmSchedule = () => {
    if (schedulingVideo && scheduledDate && scheduledTime) {
      const updatedVideos = videos.map(v =>
        v.id === schedulingVideo.id
          ? { ...v, youtube: "Scheduled" }
          : v
      );
      setVideos(updatedVideos);
      onClose();
      setSchedulingVideo(null);
      setScheduledDate(null);
      setScheduledTime('');
    }
  };

  const formatDateRange = (range) => {
    if (!range.from) return 'Select date range';
    if (!range.to) return `${format(range.from, "MMM dd, yyyy")} - Select end date`;
    return `${format(range.from, "MMM dd, yyyy")} - ${format(range.to, "MMM dd, yyyy")}`;
  };

  return (
    <Box minHeight="100vh" bg={bgColor} py={8}>
      <VStack spacing={8} align="stretch" maxW="1200px" mx="auto" px={4}>
        <Flex justify="space-between" align="center" flexWrap="wrap">
          <Heading size="xl" color={textColor} mb={4}>Video Schedule</Heading>
          <Popover>
            <PopoverTrigger>
              <Button leftIcon={<FaCalendarAlt />} colorScheme="purple">
                {formatDateRange(dateRange)}
              </Button>
            </PopoverTrigger>
            <PopoverContent p={0}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <CustomDatePicker 
                  dateRange={dateRange} 
                  onDateChange={(newRange) => {
                    setDateRange(newRange);
                    if (newRange.from && newRange.to) {
                      loadVideos();
                    }
                  }} 
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" height="50vh">
            <Spinner size="xl" color={buttonColorScheme} />
          </Flex>
        ) : (
          <Tabs isFitted colorScheme={buttonColorScheme}>
            <TabList mb="1em">
              <Tab>All Videos</Tab>
              <Tab>Not Scheduled</Tab>
              <Tab>Scheduled</Tab>
              <Tab>Posted</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
                  {videos.map(video => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onSchedule={handleScheduleVideo}
                      onEdit={handleEditSchedule}
                      onDelete={handleDeleteVideo}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
                  {videos.filter(v => v.youtube === "Not Scheduled").map(video => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onSchedule={handleScheduleVideo}
                      onEdit={handleEditSchedule}
                      onDelete={handleDeleteVideo}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
                  {videos.filter(v => v.youtube === "Scheduled").map(video => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onSchedule={handleScheduleVideo}
                      onEdit={handleEditSchedule}
                      onDelete={handleDeleteVideo}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
                  {videos.filter(v => v.youtube === "Posted").map(video => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onSchedule={handleScheduleVideo}
                      onEdit={handleEditSchedule}
                      onDelete={handleDeleteVideo}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader color={textColor}>Schedule Video for YouTube</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color={textColor}>Date</FormLabel>
                <Input
                  type="date"
                  value={scheduledDate ? format(scheduledDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => setScheduledDate(new Date(e.target.value))}
                  color={textColor}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={textColor}>Time</FormLabel>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  color={textColor}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={buttonColorScheme} onClick={handleConfirmSchedule}>
              Confirm Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SchedulePage;