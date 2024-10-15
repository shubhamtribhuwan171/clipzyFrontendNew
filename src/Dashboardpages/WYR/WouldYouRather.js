// WouldYouRather.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box, Flex, VStack, HStack, Heading, Tabs, TabList, TabPanels, Tab, TabPanel,
  useColorModeValue, Card, CardBody, Button, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Progress,
  useMediaQuery, Text
} from '@chakra-ui/react';
import { FiDownload, FiSave, FiZap } from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import BottomTabBar from '../../components/BottomTabBar';
import WouldYouRatherSettings from './WouldYouRatherSettings';
import WouldYouRatherQuestions from './WouldYouRatherQuestions';
import WouldYouRatherPreview from './WouldYouRatherPreview';
import axios from 'axios';

function WouldYouRather() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Color scheme
  const outerBgColor = useColorModeValue('#f0f0f0', '#121212');
  const outerCardBgColor = useColorModeValue('white', '#121212');
  const innerCardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const tabBgColor = useColorModeValue('purple.50', 'gray.700');
  const tabSelectedColor = useColorModeValue('white', 'purple.200');
  const tabTextColor = useColorModeValue('gray.600', 'gray.400');
  const gradientBg = useColorModeValue(
    'radial-gradient(circle at 30% 107%, #ff4500 0%, #ff8717 5%, #ff4500 45%, #ffa500 60%, #ff8c00 90%)',
    'radial-gradient(circle at 30% 107%, #25d366 0%, #128c7e 5%, #075e54 45%, #34b7f1 60%, #00a884 90%)'
  );

  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question: "",
      option1: "",
      option2: "",
      stat1: 50,
      stat2: 50,
      option1Image: null,
      option2Image: null,
      option1Frame: false,
      option2Frame: false,
      option1Transition: 'fade',
      option2Transition: 'fade',
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [delay, setDelay] = useState(5);
  const [answerDuration, setAnswerDuration] = useState(3);
  const [captionSize, setCaptionSize] = useState(48);
  const [captionColor, setCaptionColor] = useState('#FFFFFF');
  const [captionStrokeWidth, setCaptionStrokeWidth] = useState(2);
  const [captionStrokeColor, setCaptionStrokeColor] = useState('#000000');
  const [captionFont, setCaptionFont] = useState('Arial');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundAnimation, setBackgroundAnimation] = useState('none');
  const [logoImage, setLogoImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [showConfetti, setShowConfetti] = useState(true);
  const [showBackgroundAnimation, setShowBackgroundAnimation] = useState(true);
  const [selectedAudio, setSelectedAudio] = useState(null);

  const playerRef = useRef(null); // Updated ref

  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const [tokenInfo, setTokenInfo] = useState(null);

  const fetchTokenInfo = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.get('https://api.clipzy.ai/user/token-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Token Info:', response.data);
      setTokenInfo(response.data);
    } catch (error) {
      console.error('Error fetching token info:', error);
    }
  }, []);

  useEffect(() => {
    fetchTokenInfo();
  }, [fetchTokenInfo]);

  const handleAspectRatioChange = (newRatio) => {
    setAspectRatio(newRatio);
  };

  const handleBackgroundImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageRemove = () => {
    setBackgroundImage(null);
    setBackgroundAnimation('none');
  };

  const handleLogoImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoImageRemove = () => {
    setLogoImage(null);
  };

  const addNewQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      question: "",
      option1: "",
      option2: "",
      stat1: 50,
      stat2: 50,
      option1Image: null,
      option2Image: null,
      option1Frame: false,
      option2Frame: false,
      option1Transition: 'fade',
      option2Transition: 'fade',
    }]);
    setCurrentQuestionIndex(questions.length);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setCurrentQuestionIndex(Math.max(index - 1, 0));
  };

  const updateQuestionField = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    if (field === 'stat1') {
      updatedQuestions[index]['stat2'] = 100 - value;
    }
    if (field === 'stat2') {
      updatedQuestions[index]['stat1'] = 100 - value;
    }
    setQuestions(updatedQuestions);
  };

  const handleImageUpload = (event, index, option) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][`${option}Image`] = e.target.result;
        setQuestions(updatedQuestions);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index, option) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][`${option}Image`] = null;
    setQuestions(updatedQuestions);
  };

  const handleCreateVideo = () => {
    onOpen(); // Open the generating video modal
  };

  const downloadVideo = (videoBlob) => {
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'would-you-rather-video.webm'; // The name for the downloaded file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  const handleDownload = useCallback(async () => {
    if (!playerRef.current) {
      console.error('Player ref not found');
      return;
    }

    try {
      // Calculate the duration in frames
      const durationInFrames = (60 + 60 + (delay * 30) + 30) * questions.length;
      
      // Start rendering from the beginning
      await playerRef.current.seekTo(0);

      // Initialize MediaRecorder
      const stream = playerRef.current.canvas.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: 5 * 1024 * 1024, // Adjust the bitrate as needed
      });

      let recordedChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        downloadVideo(blob);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Render the video
      await playerRef.current.play();

      // Stop recording when the video ends
      setTimeout(() => {
        mediaRecorder.stop();
        playerRef.current.pause();
      }, (durationInFrames / 30) * 1000); // Assuming 30 fps

    } catch (error) {
      console.error('Error during recording:', error);
      setIsRecording(false);
    }
  }, [playerRef, delay, questions.length]);

  return (
    <Flex flexDirection="column" height="100vh" bg={outerBgColor}>
      <Flex flex={1} overflow="hidden">
        {!isMobile && <Sidebar />}
        <Box flex={1} display="flex" flexDirection="column">
          <Flex flex={1} p={4} overflow="auto" flexDirection={isMobile ? "column" : "row"}>
            <Box w={isMobile ? "100%" : "50%"} pr={isMobile ? 0 : 4} mb={isMobile ? 4 : 0}>
              {/* Top Card with Heading and Subheading */}
              <Card
                bg={gradientBg}
                shadow="md"
                mb={4}
                borderRadius="lg"
                borderWidth={1}
                borderColor={borderColor}
              >
                <CardBody>
                  <VStack spacing={2} align="start">
                    <Heading as="h2" size="lg" color="white">
                      Would You Rather Generator
                    </Heading>
                    <Text fontSize="md" color="white">
                      Create engaging 'Would You Rather' videos effortlessly!
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Parent Card with Tabs */}
              <Card
                bg={outerCardBgColor}
                shadow="lg"
                borderRadius="lg"
                borderWidth={0}
              >
                <CardBody>
                  <Tabs variant="soft-rounded" colorScheme="purple">
                    <TabList mb="1em">
                      <Tab
                        color={tabTextColor}
                        bg={tabBgColor}
                        _selected={{ color: tabSelectedColor, bg: 'purple.600' }}
                      >
                        Questions
                      </Tab>
                      <Tab
                        color={tabTextColor}
                        bg={tabBgColor}
                        _selected={{ color: tabSelectedColor, bg: 'purple.600' }}
                      >
                        Settings
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <WouldYouRatherQuestions
                          questions={questions}
                          setQuestions={setQuestions}
                          currentQuestionIndex={currentQuestionIndex}
                          setCurrentQuestionIndex={setCurrentQuestionIndex}
                          addNewQuestion={addNewQuestion}
                          deleteQuestion={deleteQuestion}
                          updateQuestionField={updateQuestionField}
                          handleImageUpload={handleImageUpload}
                          handleImageRemove={handleImageRemove}
                        />
                      </TabPanel>
                      <TabPanel>
                        <WouldYouRatherSettings
                          delay={delay}
                          setDelay={setDelay}
                          answerDuration={answerDuration}
                          setAnswerDuration={setAnswerDuration}
                          aspectRatio={aspectRatio}
                          handleAspectRatioChange={handleAspectRatioChange}
                          backgroundImage={backgroundImage}
                          handleBackgroundImageUpload={handleBackgroundImageUpload}
                          handleBackgroundImageRemove={handleBackgroundImageRemove}
                          backgroundAnimation={backgroundAnimation}
                          setBackgroundAnimation={setBackgroundAnimation}
                          logoImage={logoImage}
                          handleLogoImageUpload={handleLogoImageUpload}
                          handleLogoImageRemove={handleLogoImageRemove}
                          showConfetti={showConfetti}
                          setShowConfetti={setShowConfetti}
                          showBackgroundAnimation={showBackgroundAnimation}
                          setShowBackgroundAnimation={setShowBackgroundAnimation}
                          selectedAudio={selectedAudio}
                          setSelectedAudio={setSelectedAudio}
                        />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>

              {/* Buttons below the bigger card */}
              <HStack spacing={4} mt={4} justifyContent="flex-end">
                <Button
                  leftIcon={<FiDownload />}
                  colorScheme="purple"
                  variant="outline"
                  onClick={handleDownload}
                  isDisabled={isRecording}
                >
                  {isRecording ? 'Recording...' : 'Download'}
                </Button>
                <Button
                  leftIcon={<FiSave />}
                  colorScheme="purple"
                  onClick={() => {/* Add save logic here */ }}
                >
                  Save
                </Button>
                <Button
                  leftIcon={<FiZap />}
                  colorScheme="purple"
                  onClick={handleCreateVideo}
                >
                  Generate Video
                </Button>
              </HStack>
            </Box>

            {/* Preview Section */}
            <Box w={isMobile ? "100%" : "50%"} pl={isMobile ? 0 : 4}>
              <WouldYouRatherPreview
                questions={questions}
                delay={delay}
                answerDuration={answerDuration}
                captionSize={captionSize}
                captionColor={captionColor}
                captionStrokeWidth={captionStrokeWidth}
                captionStrokeColor={captionStrokeColor}
                captionFont={captionFont}
                aspectRatio={aspectRatio}
                backgroundImage={backgroundImage}
                backgroundAnimation={backgroundAnimation}
                logoImage={logoImage}
                ref={playerRef} // Make sure this line is present
              />
            </Box>
          </Flex>
        </Box>
      </Flex>
      {isMobile && <BottomTabBar />}

      {/* Generate Video Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={innerCardBgColor}>
          <ModalHeader color={textColor}>Generate Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text color={textColor}>Generating your 'Would You Rather' video...</Text>
              <Progress size="sm" isIndeterminate colorScheme="purple" />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" colorScheme="purple">
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default WouldYouRather;