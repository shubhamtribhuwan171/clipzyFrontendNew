import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  Link,
  useMediaQuery,
  Container,
  useColorMode,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { colorMode, toggleColorMode } = useColorMode();

  const backgroundImages = [
    '/bg/image1.jpg',
    '/bg/image2.jpg',
    '/bg/image3.jpg',
    '/bg/image4.jpg',
    '/bg/image5.jpg',
    '/bg/image6.jpg',
    '/bg/image7.jpg',
    '/bg/image8.jpg',
    '/bg/image9.jpg',
    '/bg/image10.jpg',
    '/bg/image11.jpg',
    '/bg/image12.jpg',
    '/bg/image13.jpg'
  ];

  useEffect(() => {
    if (isMobile) {
      const changeBackgroundImage = () => {
        const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
        setBackgroundImage(randomImage);
      };

      changeBackgroundImage();
      const interval = setInterval(changeBackgroundImage, 5000);

      return () => clearInterval(interval);
    } else {
      const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
      setBackgroundImage(randomImage);
    }
  }, [isMobile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        'https://api.clipzy.ai/register',
        {
          username,
          plainPassword: password,
          email,
        }
      );

      if (response.data === 'User Registered Successfully!2' || response.status === 200) {
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Registration failed: ${error.response.data}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response received from server. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again later.');
      }
      console.error('Registration error:', error);
    }
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.700', 'gray.200');
  const inputBgColor = useColorModeValue('white', 'whiteAlpha.200');
  const inputColor = useColorModeValue('gray.700', 'white');
  const placeholderColor = useColorModeValue('gray.400', 'gray.300');
  const linkColor = useColorModeValue('blue.500', 'blue.300');
  const googleBtnBorderColor = useColorModeValue("gray.200", "whiteAlpha.300");
  const googleBtnHoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');

  const renderRegisterForm = (isMobileView) => (
    <VStack spacing={4} align="stretch">
      <Heading size="xl" textAlign="center" color={isMobileView ? "white" : headingColor}>
        Join the AI Video Revolution
      </Heading>
      <Text fontSize="md" color={isMobileView ? "gray.300" : textColor} textAlign="center">
        Create, innovate, and dominate TikTok & YouTube with AI-powered shorts.
      </Text>
      {error && (
        <Text color="red.500" textAlign="center" fontSize="sm">
          {error}
        </Text>
      )}
      <VStack as="form" onSubmit={handleSubmit} spacing={4}>
        <Input 
          name="username" 
          placeholder="Choose your creator name" 
          type="text" 
          required 
          bg={isMobileView ? "whiteAlpha.200" : inputBgColor} 
          color={isMobileView ? "white" : inputColor} 
          _placeholder={{ color: isMobileView ? "gray.300" : placeholderColor }} 
        />
        <Input 
          name="email" 
          placeholder="Your email" 
          type="email" 
          required 
          bg={isMobileView ? "whiteAlpha.200" : inputBgColor} 
          color={isMobileView ? "white" : inputColor} 
          _placeholder={{ color: isMobileView ? "gray.300" : placeholderColor }} 
        />
        <Input 
          name="password" 
          placeholder="Set a password" 
          type="password" 
          required 
          bg={isMobileView ? "whiteAlpha.200" : inputBgColor} 
          color={isMobileView ? "white" : inputColor} 
          _placeholder={{ color: isMobileView ? "gray.300" : placeholderColor }} 
        />
        <Input 
          name="confirmPassword" 
          placeholder="Confirm your password" 
          type="password" 
          required 
          bg={isMobileView ? "whiteAlpha.200" : inputBgColor} 
          color={isMobileView ? "white" : inputColor} 
          _placeholder={{ color: isMobileView ? "gray.300" : placeholderColor }} 
        />
        <Button type="submit" bg="blue.500" color="white" width="full" _hover={{ bg: 'blue.600' }}>
          Start Your Creator Journey
        </Button>
      </VStack>
      <Text fontSize="sm" textAlign="center" color={isMobileView ? "white" : textColor}>
        or sign up with
      </Text>
      <Button 
        leftIcon={<FcGoogle />} 
        variant="outline" 
        color={isMobileView ? "white" : inputColor} 
        borderColor={isMobileView ? "white" : googleBtnBorderColor} 
        _hover={{ bg: isMobileView ? 'whiteAlpha.200' : googleBtnHoverBg }}
      >
        Sign up with Google
      </Button>
      <Text fontSize="sm" textAlign="center" color={isMobileView ? "white" : textColor}>
        Already creating AI videos?{' '}
        <Link color={isMobileView ? "blue.300" : linkColor} onClick={handleSignIn}>
          Sign In
        </Link>
      </Text>
    </VStack>
  );

  if (isMobile) {
    return (
      <Flex
        minHeight="100vh"
        width="full"
        direction="column"
        backgroundImage={`linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        transition="background-image 0.5s ease-in-out"
      >
        <Flex flex={1} align="center" justify="center">
          <Container maxW="90%" maxH="90vh" overflowY="auto">
            <Box
              bg="rgba(0, 0, 0, 0.7)"
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.18)"
            >
              {renderRegisterForm(true)}
            </Box>
          </Container>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex minHeight="100vh" width="full">
      <Flex flex={2} align="center" justify="center" bg={bgColor}>
        <Box position="absolute" top={4} right={4}>
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </Box>
        <Box maxW="400px" w="full">
          {renderRegisterForm(false)}
        </Box>
      </Flex>
      <Flex
        flex={3}
        bg="green.50"
        align="center"
        justify="center"
        direction="column"
        backgroundImage={`url(${backgroundImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
      >
        <Text fontSize="4xl" fontWeight="bold" textAlign="center" color="white" textShadow="1px 1px 2px black">
          Unleash Your Creativity with AI
        </Text>
        <Text fontSize="xl" textAlign="center" color="white" textShadow="1px 1px 2px black" mt={4}>
          Create stunning TikTok & YouTube shorts effortlessly
        </Text>
        <Text fontSize="lg" textAlign="center" color="white" textShadow="1px 1px 2px black" mt={2}>
          No video editing skills required!
        </Text>
      </Flex>
    </Flex>
  );
}

export default Register;
