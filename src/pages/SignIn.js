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

function SignIn() {
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
    const password = formData.get('password');

    try {
      const response = await axios.post(
        'https://api.clipzy.ai/authenticate',
        { username, password }
      );

      if (response.data && response.data.jwt) {
        localStorage.setItem('token', response.data.jwt);
        
        const userResponse = await axios.get(
          'https://api.clipzy.ai/current',
          { headers: { Authorization: `Bearer ${response.data.jwt}` } }
        );

        if (userResponse.data) {
          localStorage.setItem('userDetails', JSON.stringify(userResponse.data));
          
          if (!userResponse.data.firstName || !userResponse.data.lastName || !userResponse.data.phoneNumber) {
            navigate('/onboarding');
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Authentication error:', error);
    }
  };

  const handleRegister = () => {
    navigate('/register');
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

  const handleGoogleSignIn = async () => {
    try {
      const response = await axios.get('https://api.clipzy.ai/video/initiate-google-auth');
      console.log(response.data)
      // window.location.href = response.data;
    } catch (error) {
      console.error('Error initiating Google Auth:', error);
      setError('Failed to initiate Google Sign-in. Please try again.');
    }
  };

  const renderSignInForm = (isMobileView) => (
    <VStack spacing={4} align="stretch">
      <Heading size="xl" textAlign="center" color={isMobileView ? "white" : headingColor}>Welcome Back, Creator!</Heading>
      <Text fontSize="md" color={isMobileView ? "gray.300" : textColor} textAlign="center">
        Sign in to unleash your AI-powered video creation potential.
      </Text>
      {error && (
        <Text color="red.500" textAlign="center" fontSize="sm">
          {error}
        </Text>
      )}
      <VStack as="form" onSubmit={handleSubmit} spacing={4}>
        <Input 
          name="username" 
          placeholder="Username" 
          type="text" 
          required 
          bg={isMobileView ? "whiteAlpha.200" : inputBgColor} 
          color={isMobileView ? "white" : inputColor} 
          _placeholder={{ color: isMobileView ? "gray.300" : placeholderColor }} 
        />
        <Input 
          name="password" 
          placeholder="Password" 
          type="password" 
          required 
          bg={isMobileView ? "whiteAlpha.200" : inputBgColor} 
          color={isMobileView ? "white" : inputColor} 
          _placeholder={{ color: isMobileView ? "gray.300" : placeholderColor }} 
        />
        <Link alignSelf="flex-end" fontSize="sm" color={isMobileView ? "blue.300" : linkColor}>
          Forgot Password?
        </Link>
        <Button type="submit" bg="blue.500" color="white" width="full" _hover={{ bg: 'blue.600' }}>
          Start Creating
        </Button>
      </VStack>
      <Text fontSize="sm" textAlign="center" color={isMobileView ? "white" : textColor}>or continue with</Text>
      <Button 
        leftIcon={<FcGoogle />} 
        variant="outline" 
        color={isMobileView ? "white" : inputColor} 
        borderColor={isMobileView ? "white" : googleBtnBorderColor} 
        _hover={{ bg: isMobileView ? 'whiteAlpha.200' : googleBtnHoverBg }}
        onClick={handleGoogleSignIn}
      >
        Sign in / Sign up with Google
      </Button>
      <Text fontSize="sm" textAlign="center" color={isMobileView ? "white" : textColor}>
        New to AI video creation?{' '}
        <Link color={isMobileView ? "blue.300" : linkColor} onClick={handleRegister}>
          Join now
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
              {renderSignInForm(true)}
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
          {renderSignInForm(false)}
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
          Create Viral TikTok & YouTube Shorts with AI
        </Text>
        <Text fontSize="xl" textAlign="center" color="white" textShadow="1px 1px 2px black" mt={4}>
          Turn your ideas into engaging videos in minutes
        </Text>
      </Flex>
    </Flex>
  );
}

export default SignIn;
