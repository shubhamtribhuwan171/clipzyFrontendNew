import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  useColorModeValue,
  Container,
  Flex,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiCalendar, FiRadio, FiTarget, FiArrowRight, FiArrowLeft, FiVideo, FiEdit, FiTrendingUp, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const steps = [
  { icon: FiUser, title: "Welcome to the Studio", description: "Let's set up your profile" },
  { icon: FiCalendar, title: "Your Birthday", description: "When's your special day?" },
  { icon: FiRadio, title: "Inspiration Channel", description: "Where did you discover us?" },
  { icon: FiTarget, title: "Project Vision", description: "What's your reel goal?" },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    source: '',
    purpose: '',
  });

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://api.clipzy.ai/current',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data) {
          setFormData(prevData => ({
            ...prevData,
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            phoneNumber: response.data.phoneNumber || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const userId = userDetails.userId;

      await axios.put(
        `https://api.clipzy.ai/user/edit?id=${userId}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          source: formData.source,
          dateOfBirth: formData.dateOfBirth,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Studio Setup Complete!",
        description: "Your AI-powered reel studio is ready. Let's create some magic!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Studio setup error:', error);
      toast({
        title: "Setup Interrupted",
        description: "We hit a technical snag. Let's try that again!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const textColor = useColorModeValue('gray.800', 'white');

  const [studioElements, setStudioElements] = useState([]);

  useEffect(() => {
    const elements = [
      { icon: FiVideo, top: '10%', left: '5%', size: '40px' },
      { icon: FiEdit, top: '20%', right: '10%', size: '30px' },
      { icon: FiTrendingUp, bottom: '15%', left: '15%', size: '35px' },
      { icon: FiZap, bottom: '25%', right: '20%', size: '25px' },
    ];
    setStudioElements(elements);
  }, []);

  return (
    <Box
      minHeight="100vh"
      bg="gray.900"
      position="relative"
      overflow="hidden"
    >
      {studioElements.map((element, index) => (
        <MotionBox
          key={index}
          position="absolute"
          top={element.top}
          left={element.left}
          right={element.right}
          bottom={element.bottom}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <Icon as={element.icon} boxSize={element.size} color="purple.400" />
        </MotionBox>
      ))}
      <Container maxW="container.md" pt={20} position="relative" zIndex={1}>
        <MotionBox
          bg={bgColor}
          borderRadius="xl"
          p={8}
          boxShadow="xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8} align="stretch">
            <Flex justify="space-between" align="center">
              <Heading size="xl" color="purple.500">
                {steps[step].title}
              </Heading>
              <Icon as={steps[step].icon} boxSize={8} color="purple.500" />
            </Flex>
            <Text color={textColor}>{steps[step].description}</Text>
            <AnimatePresence mode="wait">
              <MotionBox
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 0 && (
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter your first name" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter your last name" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Enter your phone number" type="tel" />
                    </FormControl>
                  </VStack>
                )}
                {step === 1 && (
                  <FormControl isRequired>
                    <FormLabel>Birthday</FormLabel>
                    <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                  </FormControl>
                )}
                {step === 2 && (
                  <FormControl isRequired>
                    <FormLabel>How did you hear about us?</FormLabel>
                    <Select name="source" value={formData.source} onChange={handleInputChange} placeholder="Select an option">
                      <option value="social-media">Social Media</option>
                      <option value="friend">Friend or Colleague</option>
                      <option value="search">Search Engine</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="twitter">Twitter</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                )}
                {step === 3 && (
                  <FormControl isRequired>
                    <FormLabel>What's your primary purpose for using our platform?</FormLabel>
                    <Select name="purpose" value={formData.purpose} onChange={handleInputChange} placeholder="Select an option">
                      <option value="personal">Personal Projects</option>
                      <option value="business">Business Use</option>
                      <option value="education">Educational Content</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                )}
              </MotionBox>
            </AnimatePresence>
            <MotionFlex 
              justify="space-between" 
              mt={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {step > 0 && (
                <Button leftIcon={<FiArrowLeft />} onClick={handlePrevious} variant="ghost" color={textColor}>
                  Previous
                </Button>
              )}
              <Button
                rightIcon={step < steps.length - 1 ? <FiArrowRight /> : undefined}
                onClick={step < steps.length - 1 ? handleNext : handleSubmit}
                colorScheme="purple"
                ml="auto"
              >
                {step < steps.length - 1 ? 'Next' : 'Launch Studio'}
              </Button>
            </MotionFlex>
          </VStack>
        </MotionBox>
        <Text mt={4} textAlign="center" color="whiteAlpha.800">
          Step {step + 1} of {steps.length}
        </Text>
      </Container>
    </Box>
  );
};

export default Onboarding;