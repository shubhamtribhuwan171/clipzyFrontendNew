// GuessTheEmojiGenerator.js

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  FormControl,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  IconButton,
  useColorModeValue,
  Card,
  CardBody,
  FormLabel,
  Image,
  Switch,
  useDisclosure,
  Progress,
  SimpleGrid,
  useMediaQuery, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody, ModalCloseButton,ModalFooter
} from '@chakra-ui/react';
import { FiPlus, FiUpload, FiTrash2, FiSkipBack, FiSkipForward } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import GuessTheEmojiPreview from './GuessTheEmojiPreview';
import Sidebar from '../../components/Sidebar';
import BottomTabBar from '../../components/BottomTabBar';

function GuessTheEmojiGenerator() {
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  // Updated color scheme
  const outerBgColor = useColorModeValue('#f0f0f0', '#121212');
  const outerCardBgColor = useColorModeValue('white', '#121212');
  const innerCardBgColor = useColorModeValue('white', 'gray.800');
  const gradientBg = useColorModeValue(
    'radial-gradient(circle at 30% 107%, #ff4500 0%, #ff8717 5%, #ff4500 45%, #ffa500 60%, #ff8c00 90%)',
    'radial-gradient(circle at 30% 107%, #25d366 0%, #128c7e 5%, #075e54 45%, #34b7f1 60%, #00a884 90%)'
  );
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const tabBgColor = useColorModeValue('purple.50', 'gray.700');
  const tabSelectedColor = useColorModeValue('white', 'purple.200');
  const tabTextColor = useColorModeValue('gray.600', 'gray.400');

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      emojis: ['', ''],
      answer: '',
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [delay, setDelay] = useState(5);
  const [answerDuration, setAnswerDuration] = useState(3);
  const [captionFont, setCaptionFont] = useState('Arial');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundAnimation, setBackgroundAnimation] = useState('none');
  const [logoImage, setLogoImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [playerRef] = useState(useRef(null));

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showProgressImage, setShowProgressImage] = useState(true);
  const [progressImage, setProgressImage] = useState(null);

  // Background Animation Options
  const backgroundAnimationOptions = [
    { value: 'none', label: 'None' },
    { value: 'left', label: 'Move Left' },
    { value: 'right', label: 'Move Right' },
    { value: 'up', label: 'Move Up' },
    { value: 'down', label: 'Move Down' },
  ];
  const addNewQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      emojis: ['', ''],
      answer: '',
      answerImage: null,
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const updateQuestionField = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const handleBackgroundImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (backgroundImage) {
        URL.revokeObjectURL(backgroundImage);
      }
      const objectUrl = URL.createObjectURL(file);
      setBackgroundImage(objectUrl);
    }
  };

  const handleBackgroundImageRemove = () => {
    if (backgroundImage) {
      URL.revokeObjectURL(backgroundImage);
    }
    setBackgroundImage(null);
    setBackgroundAnimation('none');
  };

  const handleLogoImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (logoImage) {
        URL.revokeObjectURL(logoImage);
      }
      const objectUrl = URL.createObjectURL(file);
      setLogoImage(objectUrl);
    }
  };

  const handleLogoImageRemove = () => {
    if (logoImage) {
      URL.revokeObjectURL(logoImage);
    }
    setLogoImage(null);
  };

  const handleProgressImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setProgressImage(objectUrl);
    }
  };

  const handleProgressImageRemove = () => {
    setProgressImage(null);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    }
  };

  const renderQuestionCard = (question, index) => (
    <VStack spacing={4} align="stretch" key={question.id}>
      <Card
        bg={innerCardBgColor}
        shadow="md"
        borderRadius="lg"
        borderWidth={1}
        borderColor={borderColor}
      >
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <FormLabel color={textColor}>Question</FormLabel>
              <Input
                value={question.question}
                onChange={(e) => updateQuestionField(index, 'question', e.target.value)}
                placeholder="Enter the question"
                color={textColor}
              />
            </Box>
            <Box>
              <FormLabel color={textColor}>Emoji 1</FormLabel>
              <Input
                value={question.emojis[0]}
                onChange={(e) => {
                  const updatedEmojis = [...question.emojis];
                  updatedEmojis[0] = e.target.value;
                  updateQuestionField(index, 'emojis', updatedEmojis);
                }}
                placeholder="Enter first emoji"
                color={textColor}
              />
            </Box>
            <Box>
              <FormLabel color={textColor}>Emoji 2</FormLabel>
              <Input
                value={question.emojis[1]}
                onChange={(e) => {
                  const updatedEmojis = [...question.emojis];
                  updatedEmojis[1] = e.target.value;
                  updateQuestionField(index, 'emojis', updatedEmojis);
                }}
                placeholder="Enter second emoji"
                color={textColor}
              />
            </Box>
            <Box>
              <FormLabel color={textColor}>Answer</FormLabel>
              <Input
                value={question.answer}
                onChange={(e) => updateQuestionField(index, 'answer', e.target.value)}
                placeholder="Enter the answer"
                color={textColor}
              />
            </Box>
            <Box>
              <FormLabel color={textColor}>Answer Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateQuestionField(index, 'answerImage', reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                color={textColor}
              />
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Delete Question Button */}
      <Button
        leftIcon={<FiTrash2 />}
        colorScheme="red"
        variant="outline"
        onClick={() => deleteQuestion(index)}
        size="sm"
      >
        Delete Question
      </Button>
    </VStack>
  );

  const renderSettingsCards = () => (
    <VStack spacing={4} align="stretch">
      {/* Video and Timing Settings Card */}
      <Card
        bg={innerCardBgColor}
        shadow="md"
        borderRadius="lg"
        borderWidth={1}
        borderColor={borderColor}
      >
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md" color={textColor}>
              Video and Timing Settings
            </Heading>
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <FormLabel color={textColor}>Aspect Ratio</FormLabel>
                <Select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  color={textColor}
                >
                  <option value="16:9">Widescreen (16:9)</option>
                  <option value="9:16">Vertical (9:16)</option>
                </Select>
              </Box>
              <Box>
                <FormLabel color={textColor}>Background Animation</FormLabel>
                <Select
                  value={backgroundAnimation}
                  onChange={(e) => setBackgroundAnimation(e.target.value)}
                  color={textColor}
                >
                  {backgroundAnimationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <FormLabel color={textColor}>
                  Delay before revealing answer (seconds)
                </FormLabel>
                <NumberInput
                  value={delay}
                  onChange={(_, value) => setDelay(value)}
                  min={1}
                  max={10}
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
                <FormLabel color={textColor}>Answer Duration (seconds)</FormLabel>
                <NumberInput
                  value={answerDuration}
                  onChange={(_, value) => setAnswerDuration(value)}
                  min={1}
                  max={10}
                  color={textColor}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>

      {/* Media Settings Card */}
      <Card
        bg={innerCardBgColor}
        shadow="md"
        borderRadius="lg"
        borderWidth={1}
        borderColor={borderColor}
      >
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md" color={textColor}>
              Media Settings
            </Heading>

            <SimpleGrid columns={2} spacing={4}>
              {/* Background Image */}
              <Box>
                <FormLabel color={textColor}>Background Image</FormLabel>
                <HStack spacing={2}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    style={{ display: 'none' }}
                    id="background-image-upload"
                  />
                  <label htmlFor="background-image-upload">
                    <Button as="span" leftIcon={<FiUpload />} colorScheme="purple" size="sm">
                      {backgroundImage ? 'Change' : 'Upload'}
                    </Button>
                  </label>
                  {backgroundImage && (
                    <HStack>
                      <Image
                        src={backgroundImage}
                        boxSize="30px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Remove Background Image"
                        onClick={handleBackgroundImageRemove}
                      />
                    </HStack>
                  )}
                </HStack>
              </Box>

              {/* Logo Image */}
              <Box>
                <FormLabel color={textColor}>Logo Image</FormLabel>
                <HStack spacing={2}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoImageUpload}
                    style={{ display: 'none' }}
                    id="logo-image-upload-main"
                  />
                  <label htmlFor="logo-image-upload-main">
                    <Button as="span" leftIcon={<FiUpload />} colorScheme="purple" size="sm">
                      {logoImage ? 'Change' : 'Upload'}
                    </Button>
                  </label>
                  {logoImage && (
                    <HStack>
                      <Image
                        src={logoImage}
                        boxSize="30px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Remove Logo Image"
                        onClick={handleLogoImageRemove}
                      />
                    </HStack>
                  )}
                </HStack>
              </Box>
            </SimpleGrid>

            {/* Progress Image Settings */}
            <Box>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="show-progress-image" mb="0" color={textColor}>
                  Show Progress Image
                </FormLabel>
                <Switch
                  id="show-progress-image"
                  isChecked={showProgressImage}
                  onChange={(e) => setShowProgressImage(e.target.checked)}
                  colorScheme="purple"
                />
              </FormControl>

              {showProgressImage && (
                <Box mt={2}>
                  <HStack spacing={2}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProgressImageUpload}
                      style={{ display: 'none' }}
                      id="progress-image-upload"
                    />
                    <label htmlFor="progress-image-upload">
                      <Button as="span" leftIcon={<FiUpload />} colorScheme="purple" size="sm">
                        {progressImage ? 'Change' : 'Upload'}
                      </Button>
                    </label>
                    {progressImage && (
                      <HStack>
                        <Image
                          src={progressImage}
                          boxSize="30px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <IconButton
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          aria-label="Remove Progress Image"
                          onClick={handleProgressImageRemove}
                        />
                      </HStack>
                    )}
                  </HStack>
                </Box>
              )}
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );

  const handleCreateVideo = () => {
    // Trigger video generation logic here
    onOpen(); // Open the generating video modal
  };

  return (
    <Flex flexDirection="column" height="100vh" bg={outerBgColor}>
      <Flex flex={1} overflow="hidden">
        {!isMobile && <Sidebar />}
        <Box flex={1} display="flex" flexDirection="column">
          <Flex flex={1} p={4} overflow="auto">
            <Box w={isMobile ? '100%' : '50%'} pr={isMobile ? 0 : 4}>
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
                      Guess the Emoji
                    </Heading>
                    <Text fontSize="md" color="white">
                      Combine emojis to guess the word!
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Parent Card with Tabs */}
              <Card
                bg={outerCardBgColor}
                shadow="lg"
                borderRadius="lg"
                borderWidth={0} // Removed border
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
                      {/* Questions Tab */}
                      <TabPanel>
                        <VStack spacing={4} align="stretch">
                          {/* Top Controls */}
                          <HStack justify="space-between" alignItems="center">
                            <Button
                              leftIcon={<FiPlus />}
                              onClick={addNewQuestion}
                              colorScheme="purple"
                              size="sm"
                            >
                              Add New Question
                            </Button>
                            <HStack spacing={4} alignItems="center">
                              {/* Question Number */}
                              <Text color={textColor} fontWeight="bold">
                                Question {currentQuestionIndex + 1} of {questions.length}
                              </Text>
                              {/* Previous and Next Icon Buttons */}
                              <IconButton
                                onClick={() =>
                                  setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                                }
                                isDisabled={currentQuestionIndex === 0}
                                icon={<FiSkipBack />}
                                colorScheme="purple"
                                size="sm"
                                aria-label="Previous Question"
                              />
                              <IconButton
                                onClick={() =>
                                  setCurrentQuestionIndex(
                                    Math.min(questions.length - 1, currentQuestionIndex + 1)
                                  )
                                }
                                isDisabled={currentQuestionIndex === questions.length - 1}
                                icon={<FiSkipForward />}
                                colorScheme="purple"
                                size="sm"
                                aria-label="Next Question"
                              />
                            </HStack>
                          </HStack>

                          {/* Current Question Card */}
                          {renderQuestionCard(questions[currentQuestionIndex], currentQuestionIndex)}
                        </VStack>
                      </TabPanel>

                      {/* Settings Tab */}
                      <TabPanel>{renderSettingsCards()}</TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>
            </Box>

            {/* Guess The Emoji Preview */}
            {!isMobile && (
              <GuessTheEmojiPreview
                questions={questions}
                delay={delay}
                answerDuration={answerDuration}
                captionFont={captionFont}
                aspectRatio={aspectRatio}
                backgroundImage={backgroundImage}
                backgroundAnimation={backgroundAnimation}
                logoImage={logoImage}
                playerRef={playerRef}
                isMobile={isMobile}
                showProgressImage={showProgressImage}
                progressImage={progressImage}
              />
            )}
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
              <Text color={textColor}>Generating your emoji video...</Text>
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

export default GuessTheEmojiGenerator;