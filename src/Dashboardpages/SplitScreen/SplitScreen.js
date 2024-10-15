import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Player } from '@remotion/player';
import {
  Box, Flex, VStack, Text, Icon, Heading, Button, IconButton,
  Select, useBreakpointValue, useColorModeValue, useDisclosure,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  useToast, Modal, ModalOverlay, ModalContent, ModalBody,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Tabs, TabList, TabPanels, Tab, TabPanel, SimpleGrid, Tooltip,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
  Card, CardBody, FormLabel, Input, Progress, HStack, Divider, Radio, RadioGroup, Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import {
  FiPlay, FiPause, FiMusic, FiVideo, FiImage, FiArrowLeft, FiMenu, FiVolume2, FiMaximize, FiMinimize,
  FiSkipBack, FiSkipForward, FiSliders, FiMic, FiInfo, FiSave, FiDownload, FiTrash2, FiUpload, FiPlus, FiChevronDown
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import BottomTabBar from '../../components/BottomTabBar';
import Sidebar from '../../components/Sidebar';
import SplitScreenComposition from './SplitScreenComposition';

function SplitScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const [topMediaType, setTopMediaType] = useState('video');
  const [bottomMediaType, setBottomMediaType] = useState('video');
  const [topMedia, setTopMedia] = useState(null);
  const [bottomMedia, setBottomMedia] = useState(null);
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [voiceOver, setVoiceOver] = useState(null);
  const [audio, setAudio] = useState([]);
  const [volume, setVolume] = useState(1);
  const [transition, setTransition] = useState('none');
  const [videoDuration, setVideoDuration] = useState(30);
  const [mainPlayerPlaying, setMainPlayerPlaying] = useState(false);
  const [mainPlayerCurrentTime, setMainPlayerCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [topMediaPosition, setTopMediaPosition] = useState({ x: 0, y: 0 });
  const [bottomMediaPosition, setBottomMediaPosition] = useState({ x: 0, y: 0 });
  const [topMediaScale, setTopMediaScale] = useState(1);
  const [bottomMediaScale, setBottomMediaScale] = useState(1);
  const [topMediaVerticalPosition, setTopMediaVerticalPosition] = useState(0);
  const [bottomMediaVerticalPosition, setBottomMediaVerticalPosition] = useState(0);
  const [topMediaFit, setTopMediaFit] = useState('fill');
  const [bottomMediaFit, setBottomMediaFit] = useState('fill');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [visibleAudioTracks, setVisibleAudioTracks] = useState(5);
  const cancelRef = React.useRef();

  const mainPlayerRef = useRef(null);
  const { isOpen: isHelpOpen, onOpen: onHelpOpen, onClose: onHelpClose } = useDisclosure();
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();

  const gradientBg = useColorModeValue(
    'radial-gradient(circle at 30% 107%, #ff4500 0%, #ff8717 5%, #ff4500 45%, #ffa500 60%, #ff8c00 90%)',
    'radial-gradient(circle at 30% 107%, #25d366 0%, #128c7e 5%, #075e54 45%, #34b7f1 60%, #00a884 90%)'
  );

  useEffect(() => {
    const fetchAudioTracks = async () => {
      const response = {
        message: "Success",
        audio: [
          {
            _id: "66aa0e918347bec8eceb96df",
            type: "audio",
            name: "Bladerunner 2049",
            description: "Futuristic, popular",
            author: "",
            url: "https://strshrt.xyz/assets/66aa0e918347bec8eceb96df/audio.mp3",
            createdAt: "2024-07-31T10:14:41.231Z",
            updatedAt: "2024-09-17T08:36:03.126Z",
            __v: 0,
            prompt: "66ad1a6124565b92ef2ea6ab",
            low_volume: "https://strshrt.xyz/assets/66aa0e918347bec8eceb96df/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66aa0fb28347bec8eceb96e3",
            type: "audio",
            name: "Snowfall",
            description: "Calm, Tiktok, Popular",
            author: "",
            url: "https://strshrt.xyz/assets/66aa0fb28347bec8eceb96e3/audio.mp3",
            createdAt: "2024-07-31T10:19:30.815Z",
            updatedAt: "2024-09-17T08:36:03.692Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66aa0fb28347bec8eceb96e3/low_volume/audio.mp3",
            prompt: "66ad1a6124565b92ef2ea6ab",
            images: []
          },
          {
            _id: "66aa10418347bec8eceb96f1",
            type: "audio",
            name: "Another love",
            description: "Romantic, Calm",
            author: "",
            url: "https://strshrt.xyz/assets/66aa10418347bec8eceb96f1/audio.mp3",
            createdAt: "2024-07-31T10:21:53.241Z",
            updatedAt: "2024-09-17T08:36:04.593Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66aa10418347bec8eceb96f1/low_volume/audio.mp3",
            prompt: "66ad1a6124565b92ef2ea6ab",
            images: []
          },
          {
            _id: "66ae64e5d4dd8e5e64104ba5",
            type: "audio",
            name: "Else - Paris",
            description: "Suspense, Epic",
            author: "",
            url: "https://strshrt.xyz/assets/66ae64e5d4dd8e5e64104ba5/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T17:12:05.178Z",
            updatedAt: "2024-09-17T08:36:05.152Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae64e5d4dd8e5e64104ba5/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae6590d4dd8e5e64104bc6",
            type: "audio",
            name: "String Arpeggios",
            description: "Violin, Epic",
            author: "Boris Skalsky",
            url: "https://strshrt.xyz/assets/66ae6590d4dd8e5e64104bc6/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T17:14:56.100Z",
            updatedAt: "2024-09-17T08:36:05.776Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae6590d4dd8e5e64104bc6/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae67c2d4dd8e5e64104bfb",
            type: "audio",
            name: "As Long as in the Heart",
            description: "Travel, Calm",
            author: "Yehezkel Raz",
            url: "https://strshrt.xyz/assets/66ae67c2d4dd8e5e64104bfb/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T17:24:18.294Z",
            updatedAt: "2024-09-17T08:36:08.155Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae67c2d4dd8e5e64104bfb/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae6885d4dd8e5e64104c0e",
            type: "audio",
            name: "Für Elise",
            description: "Classical, Piano",
            author: "Ludwig van Beethoven",
            url: "https://strshrt.xyz/assets/66ae6885d4dd8e5e64104c0e/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T17:27:33.393Z",
            updatedAt: "2024-09-17T08:36:09.645Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae6885d4dd8e5e64104c0e/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae68ffd4dd8e5e64104c1f",
            type: "audio",
            name: "Prelude in E minor (Op. 28 n°4)",
            description: "Piano, Classical",
            author: "Chopin",
            url: "https://strshrt.xyz/assets/66ae68ffd4dd8e5e64104c1f/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T17:29:35.667Z",
            updatedAt: "2024-09-17T08:36:11.094Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae68ffd4dd8e5e64104c1f/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae6972d4dd8e5e64104c30",
            type: "audio",
            name: "Carmen",
            description: "Piano, Classical",
            author: "Georges Bizet",
            url: "https://strshrt.xyz/assets/66ae6972d4dd8e5e64104c30/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T17:31:30.934Z",
            updatedAt: "2024-09-17T08:36:13.246Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae6972d4dd8e5e64104c30/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae69c7d4dd8e5e64104c4f",
            type: "audio",
            name: "Eureka",
            description: "Violin, Epic",
            author: "Ardie Son",
            url: "https://strshrt.xyz/assets/66ae69c7d4dd8e5e64104c4f/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T17:32:55.737Z",
            updatedAt: "2024-09-17T08:36:14.775Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae69c7d4dd8e5e64104c4f/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae6a19d4dd8e5e64104c6e",
            type: "audio",
            name: "The Sin",
            description: "Epic, Violin, Tragic",
            author: "Francesco D'Andrea",
            url: "https://strshrt.xyz/assets/66ae6a19d4dd8e5e64104c6e/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T17:34:17.399Z",
            updatedAt: "2024-09-17T08:36:16.143Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae6a19d4dd8e5e64104c6e/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae6aaed4dd8e5e64104c7f",
            type: "audio",
            name: "Arietta",
            description: "Piano, Classical",
            author: "Edvard Grieg",
            url: "https://strshrt.xyz/assets/66ae6aaed4dd8e5e64104c7f/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T17:36:46.926Z",
            updatedAt: "2024-09-17T08:36:17.372Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae6aaed4dd8e5e64104c7f/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae8bded4dd8e5e64104d27",
            type: "audio",
            name: "Signal to Noise",
            description: "Dark and melancholic",
            author: "Scott Buckley‬ ",
            url: "https://strshrt.xyz/assets/66ae8bded4dd8e5e64104d27/audio.mp3",
            preview: "",
            prompt: null,
            createdAt: "2024-08-03T19:58:22.026Z",
            updatedAt: "2024-09-17T08:36:20.740Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae8bded4dd8e5e64104d27/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae8c3ed4dd8e5e64104d2b",
            type: "audio",
            name: "Ghost",
            description: "Scary, Suspense",
            author: "Tim Beek",
            url: "https://strshrt.xyz/assets/66ae8c3ed4dd8e5e64104d2b/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T19:59:58.280Z",
            updatedAt: "2024-09-17T08:36:22.575Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae8c3ed4dd8e5e64104d2b/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66ae8d1ad4dd8e5e64104d2e",
            type: "audio",
            name: "Inspiring",
            description: "Motivational, Inspiring",
            author: "",
            url: "https://strshrt.xyz/assets/66ae8d1ad4dd8e5e64104d2e/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-03T20:03:38.949Z",
            updatedAt: "2024-09-17T08:36:23.898Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66ae8d1ad4dd8e5e64104d2e/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66afc85ade27265b798d6572",
            type: "audio",
            name: "Epic trailer",
            description: "Epic, Classical",
            author: "Volodymyr Piddubnyk",
            url: "https://strshrt.xyz/assets/66afc85ade27265b798d6572/audio.mp3",
            preview: "",
            prompt: "66ad4d06c367dfd2ecc324b3",
            createdAt: "2024-08-04T18:28:42.580Z",
            updatedAt: "2024-09-17T08:36:24.990Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66afc85ade27265b798d6572/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66afc975de27265b798d6576",
            type: "audio",
            name: "Underwater Mystery",
            description: "Fast, Mystery",
            author: "Jon Presstone",
            url: "https://strshrt.xyz/assets/66afc975de27265b798d6576/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-04T18:33:25.311Z",
            updatedAt: "2024-09-17T08:36:26.467Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66afc975de27265b798d6576/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66afc9dfde27265b798d657b",
            type: "audio",
            name: "Making A Villain",
            description: "Violin, Epic",
            author: "Jon Presstone",
            url: "https://strshrt.xyz/assets/66afc9dfde27265b798d657b/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-04T18:35:11.377Z",
            updatedAt: "2024-09-17T08:36:27.450Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66afc9dfde27265b798d657b/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66afca68de27265b798d657e",
            type: "audio",
            name: "Tension In The Air",
            description: "Serious, Dark, Cinematic",
            author: "Jon Presstone",
            url: "https://strshrt.xyz/assets/66afca68de27265b798d657e/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-04T18:37:28.070Z",
            updatedAt: "2024-09-17T08:36:28.550Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66afca68de27265b798d657e/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66afcb82de27265b798d6581",
            type: "audio",
            name: " Tranquil Waterfall Sound",
            description: "Cinematic, Dark, Classical, Serious",
            author: "Sinsai Jasila",
            url: "https://strshrt.xyz/assets/66afcb82de27265b798d6581/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-04T18:42:10.480Z",
            updatedAt: "2024-09-17T08:36:29.648Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66afcb82de27265b798d6581/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66afcc11de27265b798d6584",
            type: "audio",
            name: "Chronicles Of Tears",
            description: "Sad, Ambient, Dark",
            author: "Saowakhon Media",
            url: "https://strshrt.xyz/assets/66afcc11de27265b798d6584/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-04T18:44:33.613Z",
            updatedAt: "2024-09-17T08:36:30.648Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66afcc11de27265b798d6584/low_volume/audio.mp3",
            images: []
          },
          {
            _id: "66afcc96de27265b798d6587",
            type: "audio",
            name: "Winter",
            description: "Classical, Epic",
            author: "Vivaldi",
            url: "https://strshrt.xyz/assets/66afcc96de27265b798d6587/audio.mp3",
            preview: "",
            prompt: "66ad1a6124565b92ef2ea6ab",
            createdAt: "2024-08-04T18:46:46.976Z",
            updatedAt: "2024-09-17T08:36:32.635Z",
            __v: 0,
            low_volume: "https://strshrt.xyz/assets/66afcc96de27265b798d6587/low_volume/audio.mp3",
            images: []
          }
        ]

      };
      setAudio(response.audio);
    };

    fetchAudioTracks();
  }, []);

  const handleFileUpload = useCallback((event, position) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (position === 'top') {
        setTopMedia(url);
        setTopMediaType(file.type.startsWith('video') ? 'video' : 'image');
      } else if (position === 'bottom') {
        setBottomMedia(url);
        setBottomMediaType(file.type.startsWith('video') ? 'video' : 'image');
      } else if (position === 'voiceOver') {
        setVoiceOver(url);
      }
      toast({
        title: "File uploaded",
        description: `${file.name} has been added to your project.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleDeleteMedia = (position) => {
    if (position === 'top') {
      setTopMedia(null);
      setTopMediaType('video');
    } else if (position === 'bottom') {
      setBottomMedia(null);
      setBottomMediaType('video');
    } else if (position === 'music') {
      setBackgroundMusic(null);
    } else if (position === 'voiceOver') {
      setVoiceOver(null);
    }
    toast({
      title: "Media removed",
      description: "The selected media has been removed from your project.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const MediaUpload = ({ type, position }) => (
    <Flex align="center">
      <input
        type="file"
        accept={type === 'video' ? 'video/*' : type === 'image' ? 'image/*' : 'audio/*'}
        onChange={(e) => handleFileUpload(e, position)}
        style={{ display: 'none' }}
        id={`file-upload-${position}`}
      />
      <label htmlFor={`file-upload-${position}`}>
        <Button as="span" leftIcon={<FiUpload />} size="sm" colorScheme="blue">
          Upload
        </Button>
      </label>
      {(position === 'top' && topMedia) || (position === 'bottom' && bottomMedia) ||
        (position === 'voiceOver' && voiceOver) ? (
        <IconButton
          icon={<FiTrash2 />}
          size="sm"
          ml={2}
          colorScheme="red"
          onClick={() => handleDeleteMedia(position)}
          aria-label="Delete media"
        />
      ) : null}
    </Flex>
  );

  const MediaPositionControls = ({
    position,
    mediaPosition,
    setMediaPosition,
    mediaScale,
    setMediaScale,
    verticalPosition,
    setVerticalPosition,
    mediaFit,
    setMediaFit
  }) => (
    <Box>
      <Text fontWeight="bold" mb={2}>{position} Media Position</Text>
      <RadioGroup onChange={setMediaFit} value={mediaFit} mb={4}>
        <HStack spacing={4}>
          <Radio value="fit">Fit</Radio>
          <Radio value="fill">Fill</Radio>
          <Radio value="custom">Custom</Radio>
        </HStack>
      </RadioGroup>
      {mediaFit === 'custom' && (
        <>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontSize="sm">Horizontal</Text>
              <Slider
                aria-label="horizontal-position"
                value={mediaPosition.x}
                min={-50}
                max={50}
                onChange={(v) => setMediaPosition({ ...mediaPosition, x: v })}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
            <Box>
              <Text fontSize="sm">Vertical</Text>
              <Slider
                aria-label="vertical-position"
                value={verticalPosition}
                min={-50}
                max={50}
                onChange={(v) => setVerticalPosition(v)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </SimpleGrid>
          <Box mt={4}>
            <Text fontSize="sm">Scale</Text>
            <Slider
              aria-label="scale"
              value={mediaScale}
              min={0.5}
              max={2}
              step={0.1}
              onChange={(v) => setMediaScale(v)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </>
      )}
    </Box>
  );

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setIsGenerated(true);
    toast({
      title: "Video generated",
      description: "Your split screen video has been generated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDownloadVideo = () => {
    const dummyContent = "This is a dummy video file content";
    const blob = new Blob([dummyContent], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'split_screen_video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Video downloaded",
      description: "Your split screen video has been downloaded to your computer.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveClick = () => {
    setIsConfirmSaveOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsConfirmSaveOpen(false);
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Project saved",
        description: "Your split screen video project has been saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "There was an error saving your project. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  const handleLoadMore = () => {
    setVisibleAudioTracks(prevCount => prevCount + 5);
  };

  return (
    <Flex flexDirection="column" height="100vh">
      <Flex flex={1} overflow="auto" flexDirection={isMobile ? "column" : "row"}>
        {!isMobile && <Sidebar />}
        <Box flex={1} p={4} bg={bgColor}>
          <Flex direction={isMobile ? "column" : "row"} h="full">
            {/* Left side: Hero heading and controls */}
            <Box w={isMobile ? "100%" : "50%"} pr={isMobile ? 0 : 4} mb={isMobile ? 4 : 0}>
              {/* Hero Heading Card */}
              <Card
                bg={gradientBg}
                shadow="md"
                mb={4}
                borderRadius="lg"
                borderWidth={1}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <CardBody>
                  <VStack spacing={2} align="start">
                    <Heading as="h2" size="lg" color="white">
                      Split Screen Video
                    </Heading>
                    <Text fontSize="md" color="white">
                      Create engaging split-screen videos with ease!
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Controls Card */}
              <Card bg={cardBgColor} shadow="md" mb={4}>
                <CardBody>
                  <Heading size="md" color={textColor} mb={4}>Split Screen Video Generator</Heading>
                  <Tabs variant="soft-rounded" colorScheme="blue">
                    <TabList mb="1em">
                      <Tab color={textColor} _selected={{ color: 'white', bg: accentColor }}>Media</Tab>
                      <Tab color={textColor} _selected={{ color: 'white', bg: accentColor }}>Settings</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <VStack spacing={4} align="stretch">
                          <Box>
                            <FormLabel color={textColor}>Top Screen</FormLabel>
                            <Flex>
                              <Select
                                size="sm"
                                value={topMediaType}
                                onChange={(e) => setTopMediaType(e.target.value)}
                                mr={2}
                                color={textColor}
                              >
                                <option value="video">Video</option>
                                <option value="image">Image</option>
                              </Select>
                              <MediaUpload type={topMediaType} position="top" />
                            </Flex>
                          </Box>
                          <Box>
                            <FormLabel color={textColor}>Bottom Screen</FormLabel>
                            <Flex>
                              <Select
                                size="sm"
                                value={bottomMediaType}
                                onChange={(e) => setBottomMediaType(e.target.value)}
                                mr={2}
                                color={textColor}
                              >
                                <option value="video">Video</option>
                                <option value="image">Image</option>
                              </Select>
                              <MediaUpload type={bottomMediaType} position="bottom" />
                            </Flex>
                          </Box>
                          <Box>
                            <FormLabel color={textColor}>Background Music</FormLabel>
                            <Select
                              size="sm"
                              value={backgroundMusic}
                              onChange={(e) => setBackgroundMusic(e.target.value)}
                              color={textColor}
                              maxHeight="200px"
                              overflowY="auto"
                              css={{
                                '&::-webkit-scrollbar': {
                                  width: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                  width: '6px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                  background: accentColor,
                                  borderRadius: '24px',
                                },
                              }}
                            >
                              <option value="">Select Background Music</option>
                              {audio.map((track) => (
                                <option key={track._id} value={track.url}>
                                  {track.name}
                                </option>
                              ))}
                            </Select>
                          </Box>
 
                        </VStack>
                      </TabPanel>
                      <TabPanel>
                        <VStack spacing={4} align="stretch">
                          <SimpleGrid columns={[1, 2]} spacing={4}>
                            <Box>
                              <FormLabel color={textColor}>Video Duration (seconds)</FormLabel>
                              <NumberInput
                                value={videoDuration}
                                onChange={(_, value) => setVideoDuration(value)}
                                min={5}
                                max={300}
                                color={textColor}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </Box>
                            <Box>
                              <FormLabel color={textColor}>Transition</FormLabel>
                              <Select
                                value={transition}
                                onChange={(e) => setTransition(e.target.value)}
                                color={textColor}
                              >
                                <option value="none">None</option>
                                <option value="fade">Fade</option>
                                <option value="slide">Slide</option>
                                <option value="zoom">Zoom</option>
                                <option value="rotate">Rotate</option>
                              </Select>
                            </Box>
                          </SimpleGrid>
                          <MediaPositionControls
                            position="Top"
                            mediaPosition={topMediaPosition}
                            setMediaPosition={setTopMediaPosition}
                            mediaScale={topMediaScale}
                            setMediaScale={setTopMediaScale}
                            verticalPosition={topMediaVerticalPosition}
                            setVerticalPosition={setTopMediaVerticalPosition}
                            mediaFit={topMediaFit}
                            setMediaFit={setTopMediaFit}
                          />
                          <MediaPositionControls
                            position="Bottom"
                            mediaPosition={bottomMediaPosition}
                            setMediaPosition={setBottomMediaPosition}
                            mediaScale={bottomMediaScale}
                            setMediaScale={setBottomMediaScale}
                            verticalPosition={bottomMediaVerticalPosition}
                            setVerticalPosition={setBottomMediaVerticalPosition}
                            mediaFit={bottomMediaFit}
                            setMediaFit={setBottomMediaFit}
                          />
                        </VStack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>

              {/* Actions Card */}
              <Card bg={cardBgColor} shadow="md" mt={4}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Heading size="sm" color={textColor}>Actions</Heading>
                    <HStack spacing={4} justify="center">
                      <Button
                        colorScheme="blue"
                        size="md"
                        leftIcon={<FiSave />}
                        onClick={handleGenerateVideo}
                        isLoading={isGenerating}
                        loadingText="Generating..."
                        flex={1}
                      >
                        Generate Video
                      </Button>
                      <Button
                        colorScheme="purple"
                        size="md"
                        leftIcon={<FiSave />}
                        onClick={handleSaveClick}
                        isLoading={isSaving}
                        loadingText="Saving..."
                        flex={1}
                      >
                        Save Project
                      </Button>
                    </HStack>
                    {isGenerated && (
                      <Button
                        colorScheme="green"
                        size="md"
                        leftIcon={<FiDownload />}
                        onClick={handleDownloadVideo}
                        width="full"
                      >
                        Download Video
                      </Button>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </Box>

            {/* Right side: Video rendering area */}
            <Box w={isMobile ? "100%" : "50%"} p={4} bg={bgColor} display="flex" justifyContent="center" alignItems="center">
              {!topMedia && !bottomMedia ? (
                <VStack
                  spacing={6}
                  align="center"
                  justify="center"
                  bg={cardBgColor}
                  p={8}
                  borderRadius="lg"
                  boxShadow="md"
                  width="100%"
                  height="100%"
                  maxWidth="400px"
                >
                  <Icon as={FiUpload} boxSize={12} color={accentColor} />
                  <Heading size="md" textAlign="center" color={textColor}>
                    No Media Uploaded Yet
                  </Heading>
                  <Text textAlign="center" color={textColor}>
                    Upload videos or images for the top and bottom screens to start creating your split-screen video.
                  </Text>
                  <VStack spacing={4} width="100%">
                    <Button
                      leftIcon={<FiVideo />}
                      colorScheme="blue"
                      variant="outline"
                      width="100%"
                      onClick={() => document.getElementById('file-upload-top').click()}
                    >
                      Upload Top Media
                    </Button>
                    <Button
                      leftIcon={<FiVideo />}
                      colorScheme="purple"
                      variant="outline"
                      width="100%"
                      onClick={() => document.getElementById('file-upload-bottom').click()}
                    >
                      Upload Bottom Media
                    </Button>
                  </VStack>
                  <Divider my={4} />
                  <VStack spacing={2} align="start" width="100%">
                    <Text fontWeight="bold" color={textColor}>Quick Tips:</Text>
                    <HStack align="start" spacing={2}>
                      <Icon as={FiInfo} color={accentColor} mt={1} />
                      <Text fontSize="sm" color={textColor}>Use high-quality videos or images for best results.</Text>
                    </HStack>
                    <HStack align="start" spacing={2}>
                      <Icon as={FiInfo} color={accentColor} mt={1} />
                      <Text fontSize="sm" color={textColor}>You can adjust media positioning and scaling in the settings tab.</Text>
                    </HStack>
                    <HStack align="start" spacing={2}>
                      <Icon as={FiInfo} color={accentColor} mt={1} />
                      <Text fontSize="sm" color={textColor}>Add background music or voice-over to enhance your video.</Text>
                    </HStack>
                  </VStack>
                </VStack>
              ) : (
                <Box width={isMobile ? "100%" : "340px"} height={isMobile ? "300px" : "600px"}>
                  <Player
                    ref={mainPlayerRef}
                    component={SplitScreenComposition}
                    durationInFrames={videoDuration * 30}
                    compositionWidth={340}
                    compositionHeight={600}
                    fps={30}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    inputProps={{
                      topMedia,
                      bottomMedia,
                      topMediaType,
                      bottomMediaType,
                      backgroundMusic,
                      voiceOver,
                      volume,
                      transition,
                      topMediaPosition,
                      bottomMediaPosition,
                      topMediaScale,
                      bottomMediaScale,
                      topMediaVerticalPosition,
                      bottomMediaVerticalPosition,
                      topMediaFit,
                      bottomMediaFit,
                    }}
                    controls
                  />
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
      </Flex>
      {isMobile && <BottomTabBar />}

      <Modal isOpen={isHelpOpen} onClose={onHelpClose}>
        <ModalOverlay />
        <ModalContent bg={cardBgColor}>
          <ModalBody>
            <VStack align="start" spacing={4}>
              <Heading size="md" color={textColor}>How to use the Split Screen Video Generator</Heading>
              <Text color={textColor}>1. Upload media for the top and bottom screens.</Text>
              <Text color={textColor}>2. Add background music and voice over (optional).</Text>
              <Text color={textColor}>3. Adjust settings like duration, transition, and media positioning.</Text>
              <Text color={textColor}>4. Preview your video in the player.</Text>
              <Text color={textColor}>5. Click "Generate Video" to create your split screen video.</Text>
              <Text color={textColor}>6. Once generated, click "Download Video" to save it to your computer.</Text>
              <Text color={textColor}>7. Use "Save Project" to save your progress at any time.</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isConfirmSaveOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmSaveOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={cardBgColor}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color={textColor}>
              Save Project
            </AlertDialogHeader>

            <AlertDialogBody color={textColor}>
              Are you sure you want to save this project?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmSaveOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="purple" onClick={handleConfirmSave} ml={3}>
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

export default SplitScreen;