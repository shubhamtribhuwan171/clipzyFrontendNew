import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RepeatIcon,
  RepeatClockIcon,
  SunIcon,
  MoonIcon,
  SettingsIcon,
  PlusSquareIcon,
  CloseIcon,
  AddIcon,
  ArrowBackIcon,
} from '@chakra-ui/icons';
import { useParams } from 'react-router-dom';

import {
  Box, Flex, IconButton, Text, Image, Tooltip, useColorMode, useColorModeValue, Menu, MenuButton, MenuList, MenuItem, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  VStack,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { EditIcon } from '@chakra-ui/icons';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import initialClips from './data/initialClips';
import wordTimings from './data/wordTimings';
import RemotionPlayer from './RemotionPlayer';
import Sidebar from '../components/Sidebar';
import EditPanel from './panels/EditPanel';
import VoicePanel from './panels/VoicePanel';
import OverlayPanel from './panels/OverlayPanel';
import MusicPanel from './panels/MusicPanel';
import WaveSurfer from 'wavesurfer.js';


const EditClipModal = ({ isOpen, onClose, selectedClip, onUpdateClip }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleGenerateAI = () => {
    // Placeholder for AI generation logic
    console.log('Generating image with AI');
  };

  const handleUploadImage = (event) => {
    // Placeholder for image upload logic
    console.log('Uploading image:', event.target.files[0]);
  };

  const handleDeleteImage = () => {
    // Placeholder for delete image logic
    console.log('Deleting image');
    onUpdateClip(null);
    onClose();
  };

  const handleFindStock = () => {
    // Placeholder for find stock image logic
    console.log('Finding stock image');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Clip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Preview</Tab>
              <Tab>Generate AI</Tab>
              <Tab>Upload</Tab>
              <Tab>Delete</Tab>
              <Tab>Find Stock</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {selectedClip && (
                  <Image
                    src={selectedClip.src}
                    alt="Selected clip preview"
                    maxWidth="100%"
                    maxHeight="400px"
                    objectFit="contain"
                  />
                )}
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Text>Generate a new image using AI</Text>
                  <Input placeholder="Enter a description for the AI" />
                  <Button onClick={handleGenerateAI}>Generate</Button>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Text>Upload a new image</Text>
                  <Input type="file" onChange={handleUploadImage} accept="image/*" />
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Text>Are you sure you want to delete this image?</Text>
                  <Button colorScheme="red" onClick={handleDeleteImage}>Delete</Button>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Text>Search for a stock image</Text>
                  <Input placeholder="Enter keywords to search" />
                  <Button onClick={handleFindStock}>Search</Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const AddClipModal = ({ isOpen, onClose, onAddClip }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [stockKeyword, setStockKeyword] = useState('');
  const toast = useToast();

  const handleSubmit = () => {
    let newClipData = {};
    switch (activeTab) {
      case 0: // Upload
        if (!uploadedImage) {
          toast({
            title: "No image uploaded",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        newClipData = { src: URL.createObjectURL(uploadedImage) };
        break;
      case 1: // URL
        if (!imageUrl) {
          toast({
            title: "No URL provided",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        newClipData = { src: imageUrl };
        break;
      case 2: // Generate AI
        // In a real application, you would call an AI image generation API here
        toast({
          title: "AI image generation",
          description: "This feature is not implemented in this demo.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      case 3: // Find Stock
        // In a real application, you would call a stock image API here
        toast({
          title: "Stock image search",
          description: "This feature is not implemented in this demo.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      default:
        return;
    }
    onAddClip(newClipData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setUploadedImage(null);
    setImageUrl('');
    setAiPrompt('');
    setStockKeyword('');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Clip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Upload</Tab>
              <Tab>URL</Tab>
              <Tab>Generate AI</Tab>
              <Tab>Find Stock</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  {uploadedImage && (
                    <Box mt={4}>
                      <Text mb={2}>Preview:</Text>
                      <Image
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Uploaded preview"
                        maxHeight="200px"
                        objectFit="contain"
                      />
                    </Box>
                  )}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Input
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <Box mt={4}>
                      <Text mb={2}>Preview:</Text>
                      <Image
                        src={imageUrl}
                        alt="URL preview"
                        maxHeight="200px"
                        objectFit="contain"
                      />
                    </Box>
                  )}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Input
                    placeholder="Enter prompt for AI image generation"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <Text fontSize="sm" color="gray.500">
                    Note: AI image generation is not implemented in this demo.
                  </Text>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Input
                    placeholder="Enter keywords to search stock images"
                    value={stockKeyword}
                    onChange={(e) => setStockKeyword(e.target.value)}
                  />
                  <Text fontSize="sm" color="gray.500">
                    Note: Stock image search is not implemented in this demo.
                  </Text>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Button mt={4} onClick={handleSubmit} colorScheme="blue">
            Add Clip
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

function Timeline() {
  const { videoId } = useParams();
  console.log('videoId in Timeline:', videoId);

  const totalDuration = useMemo(() => Math.ceil(wordTimings[wordTimings.length - 1].end), []);
  const [clips, setClips] = useState(initialClips);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timelineRef = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const [currentClip, setCurrentClip] = useState(null);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('Music');
  const waveformRef = useRef(null);
  const waveSurfer = useRef(null);
  const [availableSpace, setAvailableSpace] = useState(0);
  const [isAddClipModalOpen, setIsAddClipModalOpen] = useState(false);
  const [newClipStartTime, setNewClipStartTime] = useState(0);

  const [title, setTitle] = useState("My Timeline");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedClip, setSelectedClip] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const timelineContainerRef = useRef(null);

  const [timelineImages, setTimelineImages] = useState([]);
  const [scenes, setScenes] = useState([]);

  const fetchTimelineImages = useCallback(async () => {
    try {
      const response = await fetch(`https://api.clipzy.ai/video/images?videoId=${videoId}`);
      const images = await response.json();
      setTimelineImages(images);
    } catch (error) {
      console.error('Error fetching timeline images:', error);
    }
  }, [videoId]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(`https://api.clipzy.ai/video/all-details/${videoId}`);
        const data = await response.json();
        console.log('Video details response:', data);

        // Extract the first 5 scenes
        const firstFiveScenes = data.scenes.slice(0, 5).map(scene => ({
          title: scene.title,
          start_time: scene.start_time,
          end_time: scene.end_time
        }));

        console.log('First 5 scenes:', firstFiveScenes);
        setScenes(firstFiveScenes);

      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    const fetchVideoImages = async () => {
      try {
        const response = await fetch(`https://api.clipzy.ai/video/images?videoId=${videoId}`);
        const data = await response.json();
        console.log('Video images response:', data);
      } catch (error) {
        console.error('Error fetching video images:', error);
      }
    };

    fetchVideoDetails();
    fetchVideoImages();
    fetchTimelineImages();
  }, [videoId]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };
  useEffect(() => {
    if (waveformRef.current) {
      waveSurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'lightgrey',  // Changed from 'gray' to 'lightgrey'
        progressColor: 'black',  // Changed from 'blue' to 'black'
        cursorColor: 'transparent',
        height: 60,
        barWidth: 2,
        responsive: true,
        interact: false,
      });

      waveSurfer.current.load('/audio.mp3');

      waveSurfer.current.on('ready', () => {
        waveSurfer.current.setVolume(0.5);
      });

      return () => {
        if (waveSurfer.current) {
          waveSurfer.current.destroy();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (waveSurfer.current) {
      waveSurfer.current.seekTo(currentTime / totalDuration);
    }
  }, [currentTime, totalDuration]);

  const handleWaveformClick = (e) => {
    const rect = waveformRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newTime = (clickPosition / rect.width) * totalDuration;
    setCurrentTime(newTime);
    if (waveSurfer.current) {
      waveSurfer.current.seekTo(newTime / totalDuration);
    }
  };

  const handleMouseDown = (index) => {
    setIsDragging(true);
    setSelectedIndex(index);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || selectedIndex === null) return;
    const timelineWidth = timelineRef.current.offsetWidth;
    const newWidth = (e.clientX - timelineRef.current.getBoundingClientRect().left) / timelineWidth * totalDuration - clips[selectedIndex].startTime;

    setClips(clips.map((clip, i) => {
      if (i === selectedIndex) {
        const minWidth = 1;
        const maxWidth = i === clips.length - 1 ? totalDuration - clip.startTime : clips[i + 1].startTime - clip.startTime;
        return { ...clip, duration: Math.max(minWidth, Math.min(maxWidth, newWidth)) };
      }
      return clip;
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 0.1 * playbackSpeed;
          if (nextTime > totalDuration) {
            return isRepeat ? 0 : totalDuration;
          }
          return nextTime;
        });
      }, 100);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (interval) clearInterval(interval);
    };
  }, [isDragging, selectedIndex, isPlaying, totalDuration, isRepeat, playbackSpeed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      waveSurfer.current.pause();
    } else {
      waveSurfer.current.play();
    }
  };

  const skipBackward = () => {
    setCurrentTime((prevTime) => Math.max(0, prevTime - 5));
    waveSurfer.current.seekTo((currentTime - 5) / waveSurfer.current.getDuration());
  };

  const skipForward = () => {
    setCurrentTime((prevTime) => Math.min(totalDuration, prevTime + 5));
    waveSurfer.current.seekTo((currentTime + 5) / waveSurfer.current.getDuration());
  };

  const toggleRepeat = () => setIsRepeat(!isRepeat);

  const handleSpeedChange = (speed) => setPlaybackSpeed(speed);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const getCurrentWords = () => {
    return wordTimings
      .filter(wt => wt.start <= currentTime && wt.end > currentTime)
      .map(wt => wt.word)
      .join(' ');
  };

  useEffect(() => {
    const newCurrentClip = clips.find(clip =>
      currentTime >= clip.startTime && currentTime < (clip.startTime + clip.duration)
    );
    if (newCurrentClip !== currentClip) {
      setCurrentClip(newCurrentClip);
    }
  }, [clips, currentTime, isDragging, isPlaying, totalDuration, isRepeat, playbackSpeed]);

  const handleSidebarItemClick = (item) => {
    setSelectedSidebarItem(item === selectedSidebarItem ? null : item);
  };

  const closePanel = () => {
    setSelectedSidebarItem(null);
  };

  const bg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const handleTimelineClick = (e) => {
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newTime = (clickPosition / rect.width) * totalDuration;
    setCurrentTime(newTime);
    if (waveSurfer.current) {
      waveSurfer.current.seekTo(newTime / totalDuration);
    }
  };

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setCurrentTime((index / timelineImages.length) * totalDuration);
    if (waveSurfer.current) {
      waveSurfer.current.seekTo(index / timelineImages.length);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleEditClick = (clip) => {
    setSelectedClip(clip);
    setIsPreviewOpen(true);
  };

  const handleUpdateClip = (updatedClip) => {
    if (updatedClip === null) {
      // Handle delete
      setClips(clips.filter(c => c.id !== selectedClip.id));
    } else {
      // Handle update
      setClips(clips.map(c => c.id === selectedClip.id ? updatedClip : c));
    }
  };

  //
  const handleAddClipClick = (startTime, duration) => {
    setNewClipStartTime(startTime);
    setAvailableSpace(duration);
    setIsAddClipModalOpen(true);
  };

  const handleAddClip = (newClipData) => {
    const newClip = {
      id: Date.now(),
      startTime: newClipStartTime,
      duration: availableSpace,
      ...newClipData
    };
    setClips([...clips, newClip].sort((a, b) => a.startTime - b.startTime));
    setIsAddClipModalOpen(false);
  };

  // Function to generate timeline segments
  const generateTimelineSegments = () => {
    let segments = [];
    let lastEndTime = 0;

    clips.forEach((clip) => {
      // Add empty space before clip if there's a gap
      if (clip.startTime > lastEndTime) {
        segments.push({
          type: 'empty',
          startTime: lastEndTime,
          duration: clip.startTime - lastEndTime
        });
      }

      // Add the clip
      segments.push({
        type: 'clip',
        ...clip
      });

      lastEndTime = clip.startTime + clip.duration;
    });

    // Add empty space at the end if needed
    if (lastEndTime < totalDuration) {
      segments.push({
        type: 'empty',
        startTime: lastEndTime,
        duration: totalDuration - lastEndTime
      });
    }

    return segments;
  };

  const timelineSegments = useMemo(generateTimelineSegments, [clips, totalDuration]);

  const handleAutoFill = () => {
    if (selectedIndex === null) return;

    const updatedClips = [...clips];
    const currentClip = updatedClips[selectedIndex];
    const nextClip = updatedClips[selectedIndex + 1];

    if (nextClip) {
      const availableSpace = nextClip.startTime - currentClip.startTime;
      currentClip.duration = availableSpace;
    } else {
      currentClip.duration = totalDuration - currentClip.startTime;
    }

    setClips(updatedClips);
  };

  // Ensure totalDuration is set to the end time of the last scene
  const adjustedTotalDuration = scenes.length > 0 ? scenes[scenes.length - 1].end_time : totalDuration;

  return (
    <Box height="100vh" overflow="hidden" display="flex" flexDirection="column" bg={bg} color={textColor}>
      <Box style={{ paddingTop: '0px', paddingBottom: '0px' }} p={4} borderBottom="1px" borderColor="gray.200">
        <Flex alignItems="center">
          <Link to="/home">
            <IconButton
              icon={<ArrowBackIcon />}
              aria-label="Back to Home"
              size="md"
              variant="ghost"
              mr={4}
            />
          </Link>
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              fontSize="2xl"
              fontWeight="bold"
              variant="flushed"
              autoFocus
            />
          ) : (
            <Heading
              as="h1"
              size="xl"
              onClick={handleTitleClick}
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              {title}
            </Heading>
          )}
        </Flex>
      </Box>

      {/* Main Content Area */}
      <Flex flex="1.8" overflow="hidden">

        <Box > {/* Set flexDirection to column */}

          <Sidebar onItemClick={handleSidebarItemClick} selectedItem={selectedSidebarItem} />
        </Box>
        <Box
          width="50%" // Increased width for more space
          display="flex"
          flexDirection="column"
          bgcolor="#f5f5f5" // Light background color for contrast
          borderRadius="8px" // Rounded corners
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)" // Soft shadow for depth
          padding="16px" // Padding for spacing inside the box
        >
          {selectedSidebarItem && (
            <Box
              flex="1"
              position="relative"
              padding="16px" // Space around the panels
              border="1px solid #e0e0e0" // Subtle border around the panel
              borderRadius="8px" // Rounded corners for the panel
              bgcolor="white" // White background for the panel
            >
              {selectedSidebarItem === 'Voice' ? (
                <VoicePanel />
              ) : selectedSidebarItem === 'Overlay' ? (
                <OverlayPanel />
              ) : selectedSidebarItem === 'Music' ? (
                <Box
                // display="grid" 
                // gridTemplateColumns="repeat(2, 1fr)" // 2 columns layout for music
                // gridGap="16px" // Space between items
                >
                  {/* Music items should be rendered here in a grid */}
                  <MusicPanel />
                </Box>
              ) : (
                <EditPanel item={selectedSidebarItem} />
              )}
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                position="absolute"
                top="10px" // More space from the top
                right="10px" // More space from the right
                onClick={closePanel}
                aria-label="Close panel"
                sx={{
                  backgroundColor: '#f0f0f0', // Soft background color for the button
                  borderRadius: '50%', // Round button
                  '&:hover': {
                    backgroundColor: '#d0d0d0' // Darker shade on hover
                  }
                }}
              />
            </Box>
          )}
        </Box>

        <Box width="70%">
          <RemotionPlayer
            currentClip={currentClip}
            currentTime={currentTime}
            wordTimings={wordTimings}
            timelineImages={timelineImages} // Pass the images
            scenes={scenes} // Pass the scenes if needed
            clipTimings={clips.map(clip => ({ start: clip.startTime, end: clip.startTime + clip.duration }))} // Pass clip timings
          />
        </Box>
      </Flex>
      <hr />
      <Flex overflow="hidden" flex="1" direction="column" justifyContent="flex-end" pb={0}>
        <Box>
          {/* Timeline controls */}
          <Flex alignItems="center" mb={2}>
            <Flex flex={1}>
              <Tooltip label="Skip backward">
                <IconButton
                  icon={<ChevronLeftIcon />}
                  aria-label="Skip backward"
                  size="sm"
                  variant="ghost"
                  mr={1}
                  onClick={skipBackward}
                />
              </Tooltip>
              <Tooltip label={isPlaying ? "Pause" : "Play"}>
                <IconButton
                  icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />} // Updated to use antd icons
                  aria-label={isPlaying ? "Pause" : "Play"}
                  onClick={togglePlay}
                  size="sm"
                  variant="ghost"
                  mr={1}
                />
              </Tooltip>

              <Tooltip label="Skip forward">
                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="Skip forward"
                  size="sm"
                  variant="ghost"
                  mr={1}
                  onClick={skipForward}
                />
              </Tooltip>
              <Tooltip label="Repeat">
                <IconButton
                  icon={isRepeat ? <RepeatClockIcon /> : <RepeatIcon />}
                  aria-label="Repeat"
                  size="sm"
                  variant="ghost"
                  mr={1}
                  onClick={toggleRepeat}
                />
              </Tooltip>
              <Menu>
                <Tooltip label="Playback speed">
                  <MenuButton as={IconButton} icon={<SettingsIcon />} size="sm" variant="ghost" mr={1} />
                </Tooltip>
                <MenuList>
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <MenuItem key={speed} onClick={() => handleSpeedChange(speed)}>
                      {speed}x
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Text fontSize="sm" fontWeight="medium" mr={2}>
              {scenes.length > 0 ? (
                `${scenes[0].start_time}s - ${scenes[scenes.length - 1].end_time}s`
              ) : (
                `${Math.floor(currentTime / 60)}:${(currentTime % 60).toFixed(0).padStart(2, '0')} / ${Math.floor(totalDuration / 60)}:${(totalDuration % 60).toFixed(0).padStart(2, '0')}`
              )}
            </Text>
            <Flex>
              <Tooltip label="Toggle theme">
                <IconButton
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  aria-label="Toggle theme"
                  size="sm"
                  variant="ghost"
                  mr={1}
                  onClick={toggleColorMode}
                />
              </Tooltip>
              <Tooltip label="Auto-fill">
                <IconButton
                  icon={<PlusSquareIcon />}
                  aria-label="Auto-fill"
                  size="sm"
                  variant="ghost"
                  mr={1}
                  onClick={handleAutoFill}
                />
              </Tooltip>
              <Tooltip label="Settings">
                <IconButton
                  icon={<SettingsIcon />}
                  aria-label="Settings"
                  size="sm"
                  variant="ghost"
                  mr={1}
                // Add settings functionality here
                />
              </Tooltip>
              <Tooltip label="Fullscreen">
                <IconButton
                  icon={<PlusSquareIcon />}
                  aria-label="Fullscreen"
                  size="sm"
                  variant="ghost"
                  onClick={toggleFullscreen}
                />
              </Tooltip>
            </Flex>
          </Flex>

          {/* Current words display */}
          <Box textAlign="center" mb={2}>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>Current Words: {getCurrentWords()}</Text>
          </Box>

          {/* Timeline */}
          <Box overflow="hidden" position="relative" height="30px" mb={2}>
            {/* Horizontal line */}
            <Box
              position="absolute"
              left="0"
              right="0"
              bottom="0"
              height="2px"
              bg="gray.300"
            />

            {/* Vertical lines and labels */}
            {scenes.map((scene, index) => (
              <React.Fragment key={index}>
                {/* Start time marker */}
                <Box
                  position="absolute"
                  left={`${(scene.start_time / adjustedTotalDuration) * 100}%`}
                  bottom="0"
                  height="12px"
                  width="1px"
                  bg="gray.300"
                />
                <Text
                  position="absolute"
                  left={`${(scene.start_time / adjustedTotalDuration) * 100}%`}
                  bottom="14px"
                  fontSize="xs"
                  color="gray.600"
                  transform="translateX(-50%)"
                >
                  {scene.start_time}s
                </Text>

                {/* End time marker */}
                <Box
                  position="absolute"
                  left={`${(scene.end_time / adjustedTotalDuration) * 100}%`}
                  bottom="0"
                  height="12px"
                  width="1px"
                  bg="gray.300"
                />
                <Text
                  position="absolute"
                  left={`${(scene.end_time / adjustedTotalDuration) * 100}%`}
                  bottom="14px"
                  fontSize="xs"
                  color="gray.600"
                  transform="translateX(-50%)"
                >
                  {scene.end_time}s
                </Text>
              </React.Fragment>
            ))}

            {/* Final marker for the end of the last scene */}
            {scenes.length > 0 && (
              <>
                <Box
                  position="absolute"
                  left="100%"
                  bottom="0"
                  height="12px"
                  width="1px"
                  bg="gray.300"
                />
                <Text
                  position="absolute"
                  left="100%"
                  bottom="14px"
                  fontSize="xs"
                  color="gray.600"
                  transform="translateX(-50%)"
                >
                  {scenes[scenes.length - 1].end_time}s
                </Text>
              </>
            )}
          </Box>

          <Box
            ref={timelineContainerRef}
            position="relative"

          >
            <Box ref={waveformRef} mb={2} onClick={handleWaveformClick} cursor="pointer" />
            <Flex overflow="hidden" ref={timelineRef} position="relative" height="100px">
              {scenes.map((scene, index) => {
                const startPercentage = (scene.start_time / adjustedTotalDuration) * 100;
                const endPercentage = (scene.end_time / adjustedTotalDuration) * 100;
                const segmentWidth = endPercentage - startPercentage + '%';
                return (
                  <Box
                    key={index}
                    position="absolute"
                    left={`${startPercentage}%`}
                    width={segmentWidth}
                    height="100%"
                    p={1}
                  >
                    <Image
                      src={timelineImages[index]} // Assuming timelineImages correspond to scenes
                      alt={`Timeline image ${index + 1}`}
                      height="100%"
                      width="100%"
                      objectFit="cover"
                      borderRadius="md"
                      border={selectedIndex === index ? "2px solid #3182CE" : "2px solid #E2E8F0"}
                      onClick={() => handleImageClick(index)}
                      cursor="pointer"
                    />
                    {selectedIndex === index && (
                      <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit clip"
                        size="sm"
                        position="absolute"
                        top="5px"
                        right="5px"
                        onClick={() => handleEditClick({ id: index, src: timelineImages[index], title: scene.title })}
                      />
                    )}
                    <Text
                      position="absolute"
                      bottom="5px"
                      left="5px"
                      fontSize="xs"
                      color="white"
                      bg="rgba(0,0,0,0.5)"
                      p={1}
                      borderRadius="md"
                    >
                      {scene.title}
                    </Text>
                  </Box>
                );
              })}
            </Flex>
            <Box
              position="absolute"
              left={`${(currentTime / totalDuration) * 100}%`}
              top="0"
              bottom="0"
              width="2px"
              bg="red.500"
              zIndex="1"
              transition="left 0.1s linear"
            />
          </Box>

        </Box>
      </Flex>
      <EditClipModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        selectedClip={selectedClip}
        onUpdateClip={handleUpdateClip}
      />
      <AddClipModal
        isOpen={isAddClipModalOpen}
        onClose={() => setIsAddClipModalOpen(false)}
        onAddClip={handleAddClip}
      />
    </Box>
  );
}

export default Timeline;