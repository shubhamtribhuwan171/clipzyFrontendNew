// QuizVideoGenerator.js

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Radio,
  RadioGroup,
  IconButton,
  useColorModeValue,
  Card,
  CardBody,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  SimpleGrid,
  useMediaQuery,
  Switch,
  Image,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiUpload,
  FiTrash2,
  FiSkipBack,
  FiSkipForward,
  FiZap,
  FiDownload,
  FiSave,
} from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QuizPreview from './QuizPreview.js';
import Sidebar from '../../components/Sidebar.js';
import BottomTabBar from '../../components/BottomTabBar.js';

function QuizVideoGenerator() {
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
      type: 'text', // 'text' or 'image'
      question: '',
      questionImage: null, // Only for 'text' type
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      difficulty: 'easy',
      imageOptionA: null, // Only for 'image' type
      imageOptionB: null, // Only for 'image' type
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
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const playerRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showConfetti, setShowConfetti] = useState(true);
  const [showBackgroundAnimation, setShowBackgroundAnimation] = useState(true);
  const [selectedAudio, setSelectedAudio] = useState(null);

  const [tokenInfo, setTokenInfo] = useState(null); // Assuming tokenInfo is fetched

  const audioOptions = [
    'https://strshrt.xyz/assets/66aa0e918347bec8eceb96df/audio.mp3',
    // Add other audio URLs as needed
  ];

  // Quiz Type Options
  const quizTypeOptions = [
    { value: 'text', label: 'Text-Based Quiz' },
    { value: 'image', label: 'Image-Based Quiz' },
  ];

  // Background Animation Options
  const backgroundAnimationOptions = [
    { value: 'none', label: 'None' },
    { value: 'left', label: 'Move Left' },
    { value: 'right', label: 'Move Right' },
    { value: 'up', label: 'Move Up' },
    { value: 'down', label: 'Move Down' },
  ];

  // Fetch token info (Assuming similar to Home.js)
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

  const [showProgressImage, setShowProgressImage] = useState(true);
  const [progressImage, setProgressImage] = useState('/9c04_bi8m_210528-removebg-preview.png');

  const addNewQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'text', // Default type
      question: '',
      questionImage: null,
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      difficulty: 'easy',
      imageOptionA: null,
      imageOptionB: null,
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const updateQuestionField = (index, field, value) => {
    const updatedQuestions = [...questions];
    const oldValue = updatedQuestions[index][field];

    // Revoke old object URL if it exists and we're updating an image field
    if (
      (field === 'questionImage' ||
        field === 'imageOptionA' ||
        field === 'imageOptionB') &&
      oldValue &&
      typeof oldValue === 'string' &&
      oldValue.startsWith('blob:')
    ) {
      URL.revokeObjectURL(oldValue);
    }

    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const handleImageUpload = (event, index, field) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      updateQuestionField(index, field, objectUrl);
    }
  };

  const handleImageRemove = (index, field) => {
    const currentImage = questions[index][field];
    if (currentImage && currentImage.startsWith('blob:')) {
      URL.revokeObjectURL(currentImage);
    }
    updateQuestionField(index, field, null);
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

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      questions.forEach((question) => {
        if (question.questionImage && question.questionImage.startsWith('blob:')) {
          URL.revokeObjectURL(question.questionImage);
        }
        if (question.imageOptionA && question.imageOptionA.startsWith('blob:')) {
          URL.revokeObjectURL(question.imageOptionA);
        }
        if (question.imageOptionB && question.imageOptionB.startsWith('blob:')) {
          URL.revokeObjectURL(question.imageOptionB);
        }
      });
      if (backgroundImage && backgroundImage.startsWith('blob:')) {
        URL.revokeObjectURL(backgroundImage);
      }
      if (logoImage && logoImage.startsWith('blob:')) {
        URL.revokeObjectURL(logoImage);
      }
    };
  }, [questions, backgroundImage, logoImage]);

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);

    // Revoke object URLs of the deleted question's images
    const deletedQuestion = questions[index];
    if (deletedQuestion.questionImage && deletedQuestion.questionImage.startsWith('blob:')) {
      URL.revokeObjectURL(deletedQuestion.questionImage);
    }
    if (deletedQuestion.imageOptionA && deletedQuestion.imageOptionA.startsWith('blob:')) {
      URL.revokeObjectURL(deletedQuestion.imageOptionA);
    }
    if (deletedQuestion.imageOptionB && deletedQuestion.imageOptionB.startsWith('blob:')) {
      URL.revokeObjectURL(deletedQuestion.imageOptionB);
    }

    setQuestions(updatedQuestions);
    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    }
  };

  const renderQuestionDetailsCard = (question, index) => (
    <Card
      key={`details-${question.id}`}
      bg={innerCardBgColor}
      shadow="md"
      borderRadius="lg"
      borderWidth={1}
      borderColor={borderColor}
    >
      <CardBody>
        <VStack spacing={4} align="stretch">
          {/* Quiz Type Selection */}
          <Box>
            <FormLabel color={textColor}>Quiz Type</FormLabel>
            <Select
              value={question.type}
              onChange={(e) => updateQuestionField(index, 'type', e.target.value)}
              color={textColor}
            >
              {quizTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>

          {/* Question Text */}
          <Box>
            <FormLabel color={textColor}>Question</FormLabel>
            <Input
              value={question.question}
              onChange={(e) => updateQuestionField(index, 'question', e.target.value)}
              placeholder="Enter question"
              color={textColor}
            />
          </Box>

          {/* Conditional Rendering Based on Quiz Type */}
          {question.type === 'text' ? (
            <>
              {/* Difficulty and Question Image Upload Side by Side */}
              <HStack spacing={4}>
                <Box flex={1}>
                  <FormLabel color={textColor}>Difficulty</FormLabel>
                  <Select
                    value={question.difficulty}
                    onChange={(e) => updateQuestionField(index, 'difficulty', e.target.value)}
                    color={textColor}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Select>
                </Box>
                <Box flex={1}>
                  <FormLabel color={textColor}>Question Image</FormLabel>
                  <HStack spacing={4}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index, 'questionImage')}
                      style={{ display: 'none' }}
                      id={`question-image-upload-${question.id}`} // Unique ID
                    />
                    <label htmlFor={`question-image-upload-${question.id}`}>
                      <Button as="span" leftIcon={<FiUpload />} colorScheme="purple">
                        {question.questionImage ? 'Change Image' : 'Upload Image'}
                      </Button>
                    </label>
                    {question.questionImage && (
                      <HStack>
                        <Image
                          src={question.questionImage}
                          boxSize="50px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <IconButton
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          aria-label="Remove Question Image"
                          onClick={() => handleImageRemove(index, 'questionImage')}
                        />
                      </HStack>
                    )}
                  </HStack>
                </Box>
              </HStack>
            </>
          ) : (
            <>
              {/* Difficulty and Image Options Side by Side */}
              <HStack spacing={4}>
                <Box flex={1}>
                  <FormLabel color={textColor}>Difficulty</FormLabel>
                  <Select
                    value={question.difficulty}
                    onChange={(e) => updateQuestionField(index, 'difficulty', e.target.value)}
                    color={textColor}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Select>
                </Box>
              </HStack>

              {/* Image Options */}
              <Box>
                <FormLabel color={textColor}>Image Option A</FormLabel>
                <HStack spacing={4}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index, 'imageOptionA')}
                    style={{ display: 'none' }}
                    id={`image-optionA-upload-${question.id}`} // Unique ID
                  />
                  <label htmlFor={`image-optionA-upload-${question.id}`}>
                    <Button as="span" leftIcon={<FiUpload />} colorScheme="purple">
                      {question.imageOptionA ? 'Change Image A' : 'Upload Image A'}
                    </Button>
                  </label>
                  {question.imageOptionA && (
                    <HStack>
                      <Image
                        src={question.imageOptionA}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Remove Image Option A"
                        onClick={() => handleImageRemove(index, 'imageOptionA')}
                      />
                    </HStack>
                  )}
                </HStack>
              </Box>

              <Box>
                <FormLabel color={textColor}>Image Option B</FormLabel>
                <HStack spacing={4}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index, 'imageOptionB')}
                    style={{ display: 'none' }}
                    id={`image-optionB-upload-${question.id}`} // Unique ID
                  />
                  <label htmlFor={`image-optionB-upload-${question.id}`}>
                    <Button as="span" leftIcon={<FiUpload />} colorScheme="purple">
                      {question.imageOptionB ? 'Change Image B' : 'Upload Image B'}
                    </Button>
                  </label>
                  {question.imageOptionB && (
                    <HStack>
                      <Image
                        src={question.imageOptionB}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Remove Image Option B"
                        onClick={() => handleImageRemove(index, 'imageOptionB')}
                      />
                    </HStack>
                  )}
                </HStack>
              </Box>
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  const renderOptionsCard = (question, index) => (
    <Card
      key={`options-${question.id}`}
      bg={innerCardBgColor}
      shadow="md"
      borderRadius="lg"
      borderWidth={1}
      borderColor={borderColor}
    >
      <CardBody>
        <VStack spacing={4} align="stretch">
          {question.type === 'text' ? (
            <>
              {/* Options Inputs */}
              <Box>
                <FormLabel color={textColor}>Options</FormLabel>
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <FormLabel color={textColor}>Option A</FormLabel>
                    <Input
                      value={question.optionA}
                      onChange={(e) => updateQuestionField(index, 'optionA', e.target.value)}
                      placeholder="Option A"
                      color={textColor}
                    />
                  </Box>
                  <Box>
                    <FormLabel color={textColor}>Option B</FormLabel>
                    <Input
                      value={question.optionB}
                      onChange={(e) => updateQuestionField(index, 'optionB', e.target.value)}
                      placeholder="Option B"
                      color={textColor}
                    />
                  </Box>
                  <Box>
                    <FormLabel color={textColor}>Option C</FormLabel>
                    <Input
                      value={question.optionC}
                      onChange={(e) => updateQuestionField(index, 'optionC', e.target.value)}
                      placeholder="Option C"
                      color={textColor}
                    />
                  </Box>
                  <Box>
                    <FormLabel color={textColor}>Option D</FormLabel>
                    <Input
                      value={question.optionD}
                      onChange={(e) => updateQuestionField(index, 'optionD', e.target.value)}
                      placeholder="Option D"
                      color={textColor}
                    />
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Correct Answer Selection */}
              <Box>
                <FormLabel color={textColor}>Correct Answer</FormLabel>
                <RadioGroup
                  value={question.correctAnswer}
                  onChange={(value) => updateQuestionField(index, 'correctAnswer', value)}
                >
                  <HStack spacing={4}>
                    <Radio value="A" colorScheme="purple">
                      A
                    </Radio>
                    <Radio value="B" colorScheme="purple">
                      B
                    </Radio>
                    <Radio value="C" colorScheme="purple">
                      C
                    </Radio>
                    <Radio value="D" colorScheme="purple">
                      D
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>
            </>
          ) : (
            <>
              {/* Correct Answer Selection for Image-Based Quiz */}
              <Box>
                <FormLabel color={textColor}>Correct Answer</FormLabel>
                <RadioGroup
                  value={question.correctAnswer}
                  onChange={(value) => updateQuestionField(index, 'correctAnswer', value)}
                >
                  <HStack spacing={4}>
                    <Radio value="A" colorScheme="purple">
                      A
                    </Radio>
                    <Radio value="B" colorScheme="purple">
                      B
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>
            </>
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  const renderQuestionCard = (question, index) => (
    <VStack spacing={4} align="stretch" key={question.id}>
      {renderQuestionDetailsCard(question, index)}
      {renderOptionsCard(question, index)}
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
            <Heading size="md" color={textColor}>Video and Timing Settings</Heading>
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
            <Heading size="md" color={textColor}>Media Settings</Heading>
            
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

      {/* Visual Effects Card */}
      <Card
        bg={innerCardBgColor}
        shadow="md"
        borderRadius="lg"
        borderWidth={1}
        borderColor={borderColor}
      >
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md" color={textColor}>Visual Effects</Heading>
            
            <SimpleGrid columns={2} spacing={4}>
              {/* Show Confetti Toggle */}
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="show-confetti" mb="0" color={textColor}>
                  Show Confetti
                </FormLabel>
                <Switch
                  id="show-confetti"
                  isChecked={showConfetti}
                  onChange={(e) => setShowConfetti(e.target.checked)}
                  colorScheme="purple"
                />
              </FormControl>

              {/* Show Background Animation Toggle */}
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="show-bg-animation" mb="0" color={textColor}>
                  Show Background Animation
                </FormLabel>
                <Switch
                  id="show-bg-animation"
                  isChecked={showBackgroundAnimation}
                  onChange={(e) => setShowBackgroundAnimation(e.target.checked)}
                  colorScheme="purple"
                />
              </FormControl>
            </SimpleGrid>
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
                      Quiz Video Generator
                    </Heading>
                    <Text fontSize="md" color="white">
                      Create engaging quiz videos effortlessly!
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
                      <TabPanel>
                        {renderSettingsCards()}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>

              {/* Updated Buttons below the bigger card (Removed Generate Video Button) */}
              <HStack spacing={4} mt={4} justifyContent="flex-end">
                <Button
                  leftIcon={<FiDownload />}
                  colorScheme="purple"
                  variant="outline"
                  onClick={() => {/* Add download logic here */ }}
                >
                  Download
                </Button>
                <Button
                  leftIcon={<FiSave />}
                  colorScheme="purple"
                  onClick={() => {/* Add save logic here */ }}
                >
                  Save
                </Button>
                {/* Removed Generate Video Button */}
              </HStack>
            </Box>

            {/* Quiz Preview */}
            {!isMobile && (
              <QuizPreview
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
                logoImage={logoImage} // Ensure this prop is passed
                playerRef={playerRef}
                isMobile={isMobile}
                showConfetti={showConfetti}
                showBackgroundAnimation={showBackgroundAnimation}
                selectedAudio={selectedAudio}
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
              <Text color={textColor}>Generating your quiz video...</Text>
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

export default QuizVideoGenerator;