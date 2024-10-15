import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container, Heading, Text, SimpleGrid, Image, VStack, HStack, Center, GridItem, TagLabel, Avatar, Circle,
  TagLeftIcon, Button, Flex,Grid, Divider, Icon, List, ListItem, ListIcon, Skeleton, useColorModeValue, Wrap, WrapItem, Progress, Link, useDisclosure, Badge, Input, Tag
} from '@chakra-ui/react';
import { Switch } from '@chakra-ui/react';
import {
  Box,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet';
import { FaCrown, FaBuilding } from 'react-icons/fa';
import { motion, useViewportScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaBolt, FaCheck, FaYoutube, FaTiktok, FaCompress, FaCloudUploadAlt, FaMagic, FaClock, FaChartLine, FaArrowRight, FaGlobe, FaTwitter, FaInstagram, FaLinkedin, FaStar, FaRobot, FaPencilAlt, FaCog, FaUpload, FaBars, FaTimes, FaPalette, FaRocket, FaReddit, FaImage, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaMusic, FaVideo, FaMicrophone } from 'react-icons/fa';
import { FaBookOpen, FaLightbulb, FaGhost, FaTrophy, FaMoon, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { FaPlay, FaMars, FaVenus } from 'react-icons/fa';
import { useAnimation } from 'framer-motion';  // Add useAnimation here
import { Link as ScrollLink, Events } from 'react-scroll';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';
import useGeoLocation from '../hooks/useGeoLocation';
import axios from 'axios';


const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionButton = motion(Button);
const MotionImage = motion(Image);
const MotionCircle = motion(Circle);


const SpaceBackground = () => (
  <Box
    position="fixed"
    top="0"
    left="0"
    right="0"
    bottom="0"
    bg="black"
    zIndex="-1"
    overflow="hidden"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <radialGradient id="stars" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="galaxy" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#4B0082" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="#000016" />
      <ellipse cx="50%" cy="50%" rx="60%" ry="40%" fill="url(#galaxy)" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="200s"
          repeatCount="indefinite"
        />
      </ellipse>
      {[...Array(500)].map((_, i) => (
        <circle
          key={i}
          cx={`${Math.random() * 100}%`}
          cy={`${Math.random() * 100}%`}
          r={Math.random() * 1.5}
          fill="url(#stars)"
          opacity={Math.random() * 0.8 + 0.2}
        >
          <animate
            attributeName="opacity"
            dur={`${Math.random() * 3 + 2}s`}
            values="0.2;1;0.2"
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bgImage="url('https://www.transparenttextures.com/patterns/stardust.png')"
      opacity="0.3"
    />
  </Box>
);

const Nebula = () => (
  <MotionBox
    position="absolute"
    width="100%"
    height="100%"
    bgImage="url('https://www.transparenttextures.com/patterns/blue-dust.png')"
    bgSize="cover"
    opacity="0.1"
    animate={{
      scale: [1, 1.1, 1],
      opacity: [0.1, 0.2, 0.1],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  />
);



const HeroSection = ({ onGetStarted }) => {
  const controls = useAnimation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    });
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.username) {
      setIsLoggedIn(true);
    }
  }, [controls]);
  const handleButtonClick = () => {
      onGetStarted();
  };

  return (
    <VStack
      spacing={8}
      align="center"
      textAlign="center"
      py={32}
      position="relative"
      overflow="hidden"
    >
      <Nebula />
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" size="4xl" mb={6} fontWeight="bold" color="white">
          Create Faceless Videos in
          <Text as="span" color="green.400"> one click</Text>
        </Heading>
        <Heading as="h2" size="xl" fontWeight="normal" mb={8} color="whiteAlpha.800">
          Use AI to automatically create and post custom videos daily
        </Heading>
      </MotionBox>
      <Button
        as={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        colorScheme="green"
        size="lg"
        px={8}
        onClick={handleButtonClick}
      >
         START FOR FREE
      </Button>
    </VStack>
  );
};


const Navbar = () => {
  const [activeSection, setActiveSection] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const controls = useAnimation();
  const sections = ['howitworks', 'features',  'pricing'];
  const navItems = ['How It Works', 'Features',  'Pricing'];

  const sectionRefs = useRef(sections.map(() => ({ inView: false })));


  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    });
  }, [controls]);

  useEffect(() => {
    const observers = sections.map((_, index) => {
      return new IntersectionObserver(
        ([entry]) => {
          sectionRefs.current[index].inView = entry.isIntersecting;
          updateActiveSection();
        },
        { threshold: 0.5 }
      );
    });

    sections.forEach((_, index) => {
      const element = document.getElementById(sections[index]);
      if (element) {
        observers[index].observe(element);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const updateActiveSection = () => {
    const currentSection = sectionRefs.current.findIndex(section => section.inView);
    setActiveSection(currentSection !== -1 ? sections[currentSection] : '');
  };

  const handleScroll = useCallback(() => {
    if (window.scrollY > 100) {
      controls.start({ backgroundColor: 'rgba(0, 0, 0, 0.8)' });
    } else {
      controls.start({ backgroundColor: 'rgba(0, 0, 0, 0.3)' });
    }
    updateActiveSection();
  }, [controls]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <MotionFlex
        as="nav"
        align="center"
        justify="space-between"
        padding="0.5rem 1rem"
        position="fixed"
        top="30px"
        left={{ base: "20px", md: "30%" }}
        right={{ base: "20px", md: "auto" }}
        transform={{ base: "none", md: "translateX(-50%)" }}
        borderRadius="full"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        zIndex="1000"
        initial={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        animate={controls}
        transition={{ duration: 0.3 }}
      >
        <Flex align="center" mr={8}>  {/* Added margin-right */}
          <Text color="white" fontWeight="bold" ml={2}>Clipzy.AI</Text>
        </Flex>

        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          {navItems.map((item) => (
            <ScrollLink
              key={item}
              to={item.toLowerCase().replace(/\s+/g, '')}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              <MotionButton
                variant="ghost"
                color="white"
                fontWeight="normal"
                fontSize="sm"
                _hover={{ bg: 'transparent' }}
                _active={{ bg: 'transparent' }}
                bg={activeSection === item.toLowerCase().replace(/\s+/g, '') ? "blue.500" : "transparent"}
                borderRadius="full"
                px={4}
                py={1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </MotionButton>
            </ScrollLink>
          ))}
        </HStack>

        {/* Hamburger icon for mobile */}
        <Box display={{ base: "block", md: "none" }} onClick={onOpen}>
          <Icon
            as={FaBars}
            color="white"
            boxSize={6}
            transition="all 0.3s"
            _hover={{ transform: "scale(1.1)" }}
          />
        </Box>
      </MotionFlex>

      {/* Mobile drawer */}
      <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          bg="rgba(13, 16, 27, 0.95)"
          backdropFilter="blur(10px)"
          borderBottomRadius="2xl"
        >
          <DrawerCloseButton color="white" size="lg" />
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.300" color="white">
            Menu
          </DrawerHeader>
          <DrawerBody py={6}>
            <VStack spacing={6} align="stretch">
              {navItems.map((item) => (
                <ScrollLink
                  key={item}
                  to={item.toLowerCase().replace(/\s+/g, '')}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  onClick={onClose}
                >
                  <Button
                    variant="ghost"
                    color="white"
                    justifyContent="flex-start"
                    width="100%"
                    fontSize="lg"
                    fontWeight="medium"
                    _hover={{ bg: "whiteAlpha.200" }}
                    _active={{ bg: "whiteAlpha.300" }}
                  >
                    {item}
                  </Button>
                </ScrollLink>
              ))}
              <Button
                colorScheme="blue"
                size="lg"
                leftIcon={<Icon as={FaBolt} />}
                onClick={onClose}
                mt={4}
              >
                Get started
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const VideoCard = ({ title, imageSrc }) => {

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    });
  }, [controls]);

  return (
    <MotionBox
      whileHover={{ scale: 0.95, zIndex: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        bg="rgba(255,255,255,0.1)"
        borderRadius="lg"
        overflow="hidden"
        height="568px"
        width="320px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        backdropFilter="blur(5px)"
        border="1px solid rgba(255,255,255,0.2)"
      >
        <Image
          src={`/bg/${imageSrc}`}
          alt={title}
          objectFit="cover"
          width="100%"
          height="100%"
          borderRadius="lg"
        />
      </Box>
    </MotionBox>
  )
}

const VideoCarousel = () => {
  const [isHovered, setIsHovered] = React.useState(false);

  const videoTitles = [
    { title: "Trending Tech News", image: "image1.jpg" },
    { title: "Daily Motivation", image: "image2.jpg" },
    { title: "Cooking Tips", image: "image3.jpg" },
    { title: "Travel Vlog", image: "image4.jpg" },
    { title: "Fitness Challenge", image: "image5.jpg" },
    { title: "DIY Crafts", image: "image6.jpg" },
    { title: "Gaming Highlights", image: "image7.jpg" },
    { title: "Science Facts", image: "image8.jpg" },
    { title: "Music Review", image: "image9.jpg" }
  ];

  // Duplicate the array to create a seamless loop
  const repeatedTitles = [...videoTitles, ...videoTitles];

  return (
    <MotionBox
      animate={{ x: isHovered ? 0 : "-100%" }}
      transition={{
        x: { repeat: Infinity, duration: 30, ease: "linear" },
        opacity: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      display="flex"
      width="fit-content"
    >
      {repeatedTitles.map((item, index) => (
        <Box key={index} mx={2}>
          <VideoCard title={item.title} imageSrc={item.image} />
        </Box>
      ))}
    </MotionBox>
  );
};

const CustomizeAndStyleCard = () => {
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [currentVoiceIndex, setCurrentVoiceIndex] = useState(0);

  const fonts = ["THE QUICK", "The quick  ", "The quick"];
  const voices = [
    { name: "William", gender: "male" },
    { name: "Henry", gender: "male" },
    { name: "Hannah", gender: "female" },
  ];

  const ScrollingBackgrounds = () => (
    <MotionBox
      display="flex"
      animate={{ x: [0, -1200] }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      }}
    >
      {[...Array(12)].map((_, i) => (
        <Box
          key={i}
          bg="gray.700"
          borderRadius="md"
          p={2}
          mr={2}
          width="100px"
          height="60px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Icon as={FaImage} color="gray.500" boxSize={6} />
        </Box>
      ))}
    </MotionBox>
  );

  return (
    <BentoCard>
      <VStack align="start" spacing={4} height="100%">
        <Heading size="md" color="purple.300">Customize and Style</Heading>
        <Text color="whiteAlpha.800">Select background video, voice and a music from free templates.</Text>

        <Box width="100%">
          <Heading size="sm" mb={2}>Select your Font Style</Heading>
          <HStack spacing={2}>
            {fonts.map((font, index) => (
              <Box
                key={index}
                bg={currentFontIndex === index ? "purple.500" : "rgba(255,255,255,0.1)"}
                p={2}
                borderRadius="md"
                cursor="pointer"
                onClick={() => setCurrentFontIndex(index)}
                fontFamily={font === "THE QUICK" ? "sans-serif" : "serif"}
                fontWeight={font === "THE QUICK" ? "bold" : "normal"}
                textTransform={font === "THE QUICK" ? "uppercase" : "none"}
                fontSize="sm"
                color="white"
                textAlign="center"
                width="33%"
              >
                {font}
              </Box>
            ))}
          </HStack>
        </Box>

        <Box width="100%" overflow="hidden">
          <Heading size="sm" mb={2}>Select Story Background</Heading>
          <ScrollingBackgrounds />
        </Box>

        <Box width="100%">
          <Heading size="sm" mb={2}>Select Voice</Heading>
          <HStack spacing={2} overflowX="auto" pb={2}>
            {voices.map((voice, index) => (
              <Button
                key={index}
                size="sm"
                variant={currentVoiceIndex === index ? "solid" : "outline"}
                colorScheme="purple"
                onClick={() => setCurrentVoiceIndex(index)}
              >
                {voice.name} - {voice.gender}
              </Button>
            ))}
          </HStack>
        </Box>
      </VStack>
    </BentoCard>
  );
};


const FinishAndExportCard = () => {
  const [progress, setProgress] = useState(0);
  const circleRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0;
        }
        return prevProgress + 1;
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (circleRef.current) {
      const circumference = 2 * Math.PI * 45; // 45 is the radius of our circle
      const offset = circumference - (progress / 100) * circumference;
      circleRef.current.style.strokeDashoffset = offset.toString();
    }
  }, [progress]);

  return (
    <BentoCard>
      <VStack spacing={4} align="center" justify="center" height="100%">
        <Heading size="md" color="purple.300">Finish & Export</Heading>
        <Text textAlign="center" color="whiteAlpha.800">
          Watch your video come to life and get ready for sharing!
        </Text>
        <Box position="relative" width="200px" height="200px">
          <svg width="200" height="200" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
            />
            <circle
              ref={circleRef}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(138, 43, 226, 0.8)" // Darker purple color
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.1s' }}
            />
          </svg>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
          >
            <Text color="white" fontSize="3xl" fontWeight="bold">
              {Math.round(progress)}%
            </Text>
            <Text color="whiteAlpha.800" fontSize="sm">
              {progress < 100 ? "Exporting" : "Complete"}
            </Text>
          </Box>
        </Box>
        <HStack spacing={4}>
          <Icon as={FaVideo} color="green.400" boxSize={6} />
          <Icon as={FaFileAlt} color="blue.400" boxSize={6} />
          <Icon as={FaMusic} color="yellow.400" boxSize={6} />
        </HStack>
        <Text color="whiteAlpha.800" fontSize="sm">
          Video, Script, and Audio ready for download
        </Text>
      </VStack>
    </BentoCard>
  );
};


// Add this to your HowItWorks component
const HowItWorks = () => {
  return (
    <VStack spacing={12} align="stretch" py={20}>
      <Heading size="2xl" mb={4} color="white" textAlign="center">How It Works</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <AIScriptGeneratorCard />
        <CustomizeAndStyleCard />
        <FinishAndExportCard />
      </SimpleGrid>
    </VStack>
  );
};



const PricingCard = ({ title, icon, monthlyPrice, yearlyPrice, features, isPopular, onGetStarted, isAnnual, isLoggedIn }) => {
  const country = useGeoLocation();
  const isIndia = country === 'IN';

  const getPrice = () => {
    const price = isAnnual ? yearlyPrice : monthlyPrice;
    if (isIndia) {
      // Convert USD to INR (assuming 1 USD = 75 INR)
      const inrPrice = Math.round(price * 85);
      return `₹${inrPrice}`;
    } else {
      return `$${price}`;
    }
  };

  return (
    <MotionBox
      bg="rgba(255,255,255,0.1)"
      p={6}
      borderRadius="xl"
      boxShadow="xl"
      backdropFilter="blur(10px)"
      border="1px solid rgba(255,255,255,0.2)"
      textAlign="center"
      whileHover={{ scale: 1.05, boxShadow: "2xl" }}
      transition={{ duration: 0.2 }}
      position="relative"
      height="100%"
      display="flex"
      flexDirection="column"
      maxWidth="300px"
      mx="auto"
    >
      {isPopular && (
        <Badge
          colorScheme="purple"
          position="absolute"
          top="-3"
          right="-3"
          fontSize="0.8em"
          px={3}
          py={1}
          borderRadius="full"
        >
          Most Popular
        </Badge>
      )}
      <VStack spacing={4} align="center" flex={1}>
        <Text fontSize="3xl" fontWeight="bold" color="purple.300">{icon}</Text>
        <Heading size="lg" color="white">{title}</Heading>
        <Text fontSize="3xl" fontWeight="bold" color="white">
          {getPrice()}<Text as="span" fontSize="sm" fontWeight="normal">/month</Text>
        </Text>
        {isAnnual && monthlyPrice > 0 && (
          <Text fontSize="sm" color="green.300">
            Save 20%
          </Text>
        )}
        <Divider />
        <List spacing={2} textAlign="left" w="100%">
          {features.map((feature, index) => (
            <ListItem key={index} color="whiteAlpha.800" fontSize="sm">
              <ListIcon as={FaCheck} color="green.500" />
              {feature}
            </ListItem>
          ))}
        </List>
      </VStack>
      <Button
        colorScheme="purple"
        size="lg"
        w="full"
        mt={6}
        onClick={onGetStarted}
      >
        {isLoggedIn ? 'Access Dashboard' : 'Get Started'}
      </Button>
    </MotionBox>
  );
};

const PricingSection = ({ onGetStarted, isLoggedIn }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <Box py={20}>
      <VStack spacing={8}>
        <Heading size="2xl" color="white">Choose Your Plan</Heading>
        <Text fontSize="xl" color="whiteAlpha.800" textAlign="center" maxW="2xl">
          Select the perfect plan for your content creation needs. All plans include our core AI-powered features.
        </Text>
        <HStack>
          <Text color="white">Monthly</Text>
          <Switch
            colorScheme="purple"
            size="lg"
            isChecked={isAnnual}
            onChange={() => setIsAnnual(!isAnnual)}
          />
          <Text color="white">Annual</Text>
          {isAnnual && (
            <Badge colorScheme="green" ml={2}>
              Save with yearly billing
            </Badge>
          )}
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} width="full" maxW="1200px">
          <PricingCard
            title="Free"
            icon="✨"
            monthlyPrice={0}
            yearlyPrice={0}
            features={[
              "1 AI-generated video per month",
              "Edit & preview videos",
              "720p video quality",
              "Number of Voices: 50",
              "Number of Languages: 4"
            ]}
            onGetStarted={onGetStarted}
            isAnnual={isAnnual}
            isLoggedIn={isLoggedIn}
          />
          <PricingCard
            title="Starter"
            icon="🚀"
            monthlyPrice={19}
            yearlyPrice={15}
            features={[
              "15 AI-generated videos per month",
              "Edit & preview videos",
              "Auto-post to channel",
              "HD video resolution",
              "Background music",
              "Voice cloning",
              "No watermark",
              "Number of Voices: 50",
              "Number of Languages: 4",
              "Discord Support"
            ]}
            onGetStarted={onGetStarted}
            isAnnual={isAnnual}
            isLoggedIn={isLoggedIn}
          />
          <PricingCard
            title="Pro"
            icon="💼"
            monthlyPrice={39}
            yearlyPrice={31}
            features={[
              "45 AI-generated videos per month",
              "Edit & preview videos",
              "Auto-post to channel",
              "HD video resolution",
              "Background music",
              "Voice cloning",
              "No watermark",
              "Number of Voices: 50",
              "Number of Languages: 4",
              "Discord Support"
            ]}
            isPopular
            onGetStarted={onGetStarted}
            isAnnual={isAnnual}
            isLoggedIn={isLoggedIn}
          />
          <PricingCard
            title="Enterprise"
            icon="🏢"
            monthlyPrice={69}
            yearlyPrice={55}
            features={[
              "90 AI-generated videos per month",
              "Edit & preview videos",
              "Auto-post to channel",
              "HD video resolution",
              "Background music",
              "Voice cloning",
              "No watermark",
              "Number of Voices: 50",
              "Number of Languages: 4",
              "Discord Support"
            ]}
            onGetStarted={onGetStarted}
            isAnnual={isAnnual}
            isLoggedIn={isLoggedIn}
          />
        </SimpleGrid>
      </VStack>
    </Box>
  );
};


const Footer = () => {

  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    });
  }, [controls]);

  return (
    <Box bg="rgba(0,0,0,0.8)" color="white" py={10} position="relative" overflow="hidden">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <VStack align="start">
            <Heading size="md" mb={4}>Clipzy.AI</Heading>
            <Text fontSize="sm">Create faceless content with AI</Text>
          </VStack>
          <VStack align="start">
            <Heading size="sm" mb={4}>Product</Heading>
            <ScrollLink to="features" smooth={true} duration={500} offset={-70}>
              <Link _hover={{ color: 'purple.300' }}>Features</Link>
            </ScrollLink>
            <ScrollLink to="pricing" smooth={true} duration={500} offset={-70}>
              <Link _hover={{ color: 'purple.300' }}>Pricing</Link>
            </ScrollLink>
            <Link
              onClick={() => navigate('/blog')}
              _hover={{ color: 'purple.300' }}
            >
              Blog
            </Link>
            <RouterLink to="/faq">
              {/* <Link _hover={{ color: 'purple.300' }}>FAQ</Link> */}
            </RouterLink>
          </VStack>
          <VStack align="start">
            <Heading size="sm" mb={4}>Company</Heading>
            <RouterLink to="/about-us">
              <Link _hover={{ color: 'purple.300' }}>About Us</Link>
            </RouterLink>
            <RouterLink to="/contact">
              <Link _hover={{ color: 'purple.300' }}>Contact</Link>
            </RouterLink>
            <RouterLink to="/affiliate">
              <Link _hover={{ color: 'purple.300' }}>Affiliate</Link>
            </RouterLink>
            <RouterLink to="/refund-policy">
              <Link _hover={{ color: 'purple.300' }}>Refund Policy</Link>
            </RouterLink>
          </VStack>
          <VStack align="start">
            <Heading size="sm" mb={4}>Legal</Heading>
            <RouterLink to="/privacy-policy">
              <Link _hover={{ color: 'purple.300' }}>Privacy Policy</Link>
            </RouterLink>
            <RouterLink to="/terms-and-conditions">
              <Link _hover={{ color: 'purple.300' }}>Terms and Conditions</Link>
            </RouterLink>
            
            <RouterLink to="/faq">
              <Link _hover={{ color: 'purple.300' }}>FAQ</Link>
            </RouterLink>
          </VStack>
        </SimpleGrid>
        <VStack mt={10} spacing={4}>
          <HStack spacing={4}>
            <MotionFlex
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon as={FaTwitter} w={6} h={6} cursor="pointer" />
            </MotionFlex>
            <MotionFlex
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon as={FaInstagram} w={6} h={6} cursor="pointer" />
            </MotionFlex>
            <MotionFlex
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon as={FaLinkedin} w={6} h={6} cursor="pointer" />
            </MotionFlex>
          </HStack>
          <Text textAlign="center" fontSize="sm">
            © 2024 Clipzy.AI. All rights reserved.
          </Text>
        </VStack>
      </Container>
      <Box
        position="absolute"
        top="-50%"
        left="-20%"
        width="140%"
        height="200%"
        transform="rotate(-5deg)"
        bg="linear-gradient(45deg, rgba(138, 43, 226, 0.1) 0%, rgba(75, 0, 130, 0.1) 100%)"
        filter="blur(100px)"
        zIndex="-1"
      />
    </Box>
  )
}


const ScrollingColumn = ({ direction }) => (
  <MotionBox
    display="flex"
    flexDirection="column"
    animate={{ y: direction === 'up' ? [-1200, 0] : [0, -1200] }}
    transition={{
      y: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    }}
  >
    {[...Array(24)].map((_, i) => (
      <Box
        key={i}
        bg="gray.700"
        borderRadius="md"
        p={2}
        mb={2}
        width="100px"
        height="60px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        <Icon as={FaImage} color="gray.500" boxSize={6} />
      </Box>
    ))}
  </MotionBox>
);

const BackgroundVideosCard = () => {
  return (
    <BentoCard>
      <Heading size="md" color="purple.300" mb={2}>Background Videos</Heading>
      <Text color="whiteAlpha.800" mb={4}>Select custom backgrounds from templates.</Text>
      <HStack spacing={4} overflow="hidden" height="200px">
        <ScrollingColumn direction="up" />
        <ScrollingColumn direction="down" />
        <ScrollingColumn direction="up" />
      </HStack>
    </BentoCard>
  );
};

const voiceOptions = [
  { name: "Alex", gender: "male", tone: "Friendly" },
  { name: "Samantha", gender: "female", tone: "Professional" },
  { name: "John", gender: "male", tone: "Authoritative" },
  { name: "Emily", gender: "female", tone: "Cheerful" },
  { name: "Michael", gender: "male", tone: "Serious" },
  { name: "Sophie", gender: "female", tone: "Calm" },
  { name: "David", gender: "male", tone: "Energetic" },
  { name: "Olivia", gender: "female", tone: "Sympathetic" },
];

const VoiceCard = ({ name, gender, tone, isSelected }) => (
  <Box
    bg={isSelected ? "rgba(138, 43, 226, 0.3)" : "rgba(255,255,255,0.08)"}
    p={3}
    borderRadius="md"
    mb={2}
    width="100%"
    borderLeft="4px solid"
    borderColor={gender === "male" ? "blue.400" : "pink.400"}
    transition="all 0.3s"
    transform={isSelected ? "scale(1.05)" : "scale(1)"}
    boxShadow={isSelected ? "0 0 15px rgba(138, 43, 226, 0.5)" : "none"}
  >
    <HStack justify="space-between">
      <VStack align="start" spacing={0}>
        <Text color="white" fontWeight="bold">{name}</Text>
        <HStack>
          <Icon as={gender === "male" ? FaMars : FaVenus} color={gender === "male" ? "blue.300" : "pink.300"} />
          <Text color="whiteAlpha.700" fontSize="sm">{tone}</Text>
        </HStack>
      </VStack>
      <Button
        size="sm"
        colorScheme={isSelected ? "purple" : "whiteAlpha"}
        variant={isSelected ? "solid" : "outline"}
      >
        {isSelected ? "Selected" : "Select"}
      </Button>
    </HStack>
  </Box>
);

const AudioVoiceoverCard = () => {
  const controls = useAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const animateCards = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
      await controls.start({
        y: -80,
        transition: { duration: 0.5, ease: "easeInOut" }
      });
      controls.set({ y: 0 });
      setCurrentIndex((prevIndex) => (prevIndex + 1) % voiceOptions.length);
    };

    const interval = setInterval(animateCards, 2500); // Complete cycle every 2.5 seconds
    return () => clearInterval(interval);
  }, [controls]);

  return (
    <BentoCard>
      <Heading size="md" color="purple.300" mb={2}>Audio/Voiceover Selection</Heading>
      <Text color="whiteAlpha.800" mb={4}>Choose from a variety of voices for your video.</Text>
      <Box height="240px" overflow="hidden" position="relative">
        <MotionBox animate={controls} initial={{ y: 0 }}>
          {[...voiceOptions, ...voiceOptions].map((voice, index) => (
            <Box key={index} mb={2}>
              <VoiceCard
                {...voice}
                isSelected={index % voiceOptions.length === currentIndex}
              />
            </Box>
          ))}
        </MotionBox>
      </Box>
    </BentoCard>
  );
};


const platforms = [
  { name: 'YouTube', icon: FaYoutube },
  { name: 'Instagram', icon: FaInstagram },
  { name: 'TikTok', icon: FaTiktok },

];

const PlatformButton = ({ platform, isSelected }) => (
  <Box
    bg={isSelected ? 'purple.500' : 'transparent'}
    color={isSelected ? 'white' : 'gray.400'}
    px={3}
    py={1}
    borderRadius="full"
    transition="all 0.3s"
  >
    {platform.name}
  </Box>
);

const MultipurposeVideosCard = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedPlatform((current) => {
        const currentIndex = platforms.findIndex(p => p.name === current.name);
        const nextIndex = (currentIndex + 1) % platforms.length;
        return platforms[nextIndex];
      });
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <BentoCard>
      <VStack align="start" spacing={4}>
        <Heading size="md" color="purple.300">Multi Purpose Videos</Heading>
        <Text color="whiteAlpha.800">Create videos for different platforms with tailored content.</Text>

        <HStack spacing={2} overflowX="auto" width="100%" py={2}>
          {platforms.map((platform) => (
            <PlatformButton
              key={platform.name}
              platform={platform}
              isSelected={selectedPlatform.name === platform.name}
            />
          ))}
        </HStack>

        <AnimatePresence mode="wait">
          <MotionBox
            key={selectedPlatform.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            width="100%"
            height="150px"
            bg="rgba(255,255,255,0.1)"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Icon as={selectedPlatform.icon} boxSize={12} color="purple.500" />
            <Text color="white" mt={2} fontSize="lg" fontWeight="bold">
              {selectedPlatform.name} Video
            </Text>
            <Text color="whiteAlpha.800" mt={1} fontSize="sm">
              Optimized for {selectedPlatform.name} audience
            </Text>
          </MotionBox>
        </AnimatePresence>
      </VStack>
    </BentoCard>
  );
};


const prompts = [
  "Romantic comedy set in Paris",
  "Sci-fi adventure on a distant planet",
  "Mystery thriller in a small town",
  "Historical drama during World War II"
];

const AIScriptGeneratorCard = ({ onGetStarted }) => {
  const [displayText, setDisplayText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    });
  }, [controls]);

  useEffect(() => {
    let timeout;
    if (isTyping) {
      if (displayText.length < prompts[promptIndex].length) {
        timeout = setTimeout(() => {
          setDisplayText(prompts[promptIndex].slice(0, displayText.length + 1));
        }, 100);
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsTyping(true);
        }, 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setPromptIndex((promptIndex + 1) % prompts.length);
        setIsTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, promptIndex, isTyping]);

  return (
    <BentoCard>
      <VStack align="start" spacing={4} height="100%">
        <Heading size="md" color="purple.300">AI Script Generator</Heading>
        <Text color="whiteAlpha.800">Start with writing script using a prompt or using template suggestions.</Text>
        <Box position="relative" width="100%" flex={1}>
          <Input
            placeholder="Enter your story topic"
            bg="rgba(255,255,255,0.1)"
            border="none"
            color="white"
            value={displayText}
            onChange={() => { }}
          />
          <AnimatePresence>
            {!isTyping && (
              <MotionBox
                position="absolute"
                right="10px"
                top="50%"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Box as="span" borderRight="2px solid" borderColor="purple.500" h="20px" />
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>
        <VStack spacing={2} width="100%">
          <Skeleton height="20px" width="100%" startColor="purple.900" endColor="purple.700" />
          <Skeleton height="20px" width="100%" startColor="purple.900" endColor="purple.700" />
          <Skeleton height="20px" width="100%" startColor="purple.900" endColor="purple.700" />
        </VStack>
        <Button size="sm" colorScheme="purple" alignSelf="flex-start" onClick={onGetStarted}>
          Generate Script
        </Button>
      </VStack>
    </BentoCard>
  );
};



const categories = [
  ["Stories", "Fun Facts", "Scary Stories", "Success Mindset", "Bedtime Stories", "Motivational", "Travel Vlogs", "Cooking Tutorials"],
  ["Tech Reviews", "Fashion Tips", "DIY Projects", "Fitness Routines", "Language Learning", "Science Experiments", "Art Tutorials", "Music Lessons"],
  ["Pet Care", "Gardening Tips", "Financial Advice", "Movie Reviews", "Book Summaries", "History Facts", "Space Exploration", "Wildlife Documentaries"],
  ["Comedy Sketches", "Magic Tricks", "Life Hacks", "Makeup Tutorials", "Car Reviews", "Yoga Classes", "Meditation Guides", "Productivity Tips"]
];

const ScrollingRow = ({ items, direction }) => (
  <Box width="100%" overflow="hidden" my={1}>
    <MotionBox
      display="flex"
      animate={{ x: direction === 'left' ? [0, -3840] : [-3840, 0] }}
      transition={{
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 60,
          ease: "linear",
        },
      }}
    >
      {[...items, ...items, ...items, ...items].map((category, index) => (
        <Box
          key={index}
          bg="rgba(255,255,255,0.1)" color="white"
          px={3}
          py={1}
          borderRadius="full"
          mr={2}
          whiteSpace="nowrap"
        >
          {category}
        </Box>
      ))}
    </MotionBox>
  </Box>
);


const BentoCard = ({ children }) => (
  <MotionBox
    bg="rgba(255,255,255,0.05)"
    p={6}
    borderRadius="xl"
    boxShadow="0 0 20px rgba(138, 43, 226, 0.2)"
    backdropFilter="blur(10px)"
    border="1px solid rgba(255,255,255,0.1)"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </MotionBox>
);


const AutomateVideosCard = () => {
  return (
    <BentoCard>
      <VStack align="start" spacing={4}>
        <Heading size="md" color="purple.300">Automate Videos in Seconds</Heading>
        <Text color="whiteAlpha.800">Choose from a wide variety of topics or create your own custom story.</Text>
        {categories.map((row, index) => (
          <ScrollingRow key={index} items={row} direction={index % 2 === 0 ? 'left' : 'right'} />
        ))}
      </VStack>
    </BentoCard>
  );
};


const CaptionStyleButton = ({ style, isSelected }) => (
  <Button
    variant={isSelected ? "solid" : "outline"}
    colorScheme="purple"
    size="sm"
    mb={2}
    width="50%"
  >
    {style}
  </Button>
);

const AutoSubtitlesCard = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState('Basic');
  const samplePhrases = [
    "This is a",
    "subtitle style",
    "for this video.",
    "It changes automatically."
  ];

  const subtitleStyles = {
    Basic: {
      fontFamily: "'Arial', sans-serif",
      color: "white",
      textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
    },
    Revid: {
      fontFamily: "'Arial Black', sans-serif",
      color: "white",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    Hormozi: {
      fontFamily: "'Impact', sans-serif",
      color: "black",
      backgroundColor: "yellow",
    },
    Ali: {
      fontFamily: "'Helvetica', sans-serif",
      color: "#1DA1F2",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % samplePhrases.length);
      setSelectedStyle((prevStyle) => {
        const styles = Object.keys(subtitleStyles);
        const currentIndex = styles.indexOf(prevStyle);
        return styles[(currentIndex + 1) % styles.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BentoCard>
      <VStack spacing={4} align="stretch" height="100%">
        <Heading size="md" color="purple.300">Auto Subtitles</Heading>
        <Text fontSize="sm" color="whiteAlpha.800">
          Automatic AI subtitles generator with multiple styles.
        </Text>
        <Flex>
          <Box
            width="140px"
            height="280px"
            bg="black"
            borderRadius="24px"
            overflow="hidden"
            position="relative"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            mr={4}
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="linear-gradient(45deg, #121212, #2d3748)"
            />
            <AnimatePresence mode="wait">
              <MotionBox
                key={currentPhraseIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                position="absolute"
                bottom="20px"
                left="10px"
                right="10px"
                p={2}
                borderRadius="md"
                style={subtitleStyles[selectedStyle]}
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textAlign="center"
                >
                  {samplePhrases[currentPhraseIndex]}
                </Text>
              </MotionBox>
            </AnimatePresence>
          </Box>
          <VStack spacing={2} align="stretch" flex={1}>
            {Object.keys(subtitleStyles).map((style) => (
              <CaptionStyleButton
                key={style}
                style={style}
                isSelected={selectedStyle === style}
              />
            ))}
          </VStack>
        </Flex>
      </VStack>
    </BentoCard>
  );
};

const PlatformTag = ({ platform, isSelected, onClick }) => (
  <Tag
    size="md"
    variant={isSelected ? "solid" : "outline"}
    colorScheme={platform === 'YouTube' ? "red" : "gray"}
    cursor="pointer"
    onClick={onClick}
  >
    <TagLeftIcon as={platform === 'YouTube' ? FaYoutube : FaTiktok} />
    <TagLabel>{platform}</TagLabel>
  </Tag>
);

const SchedulingCard = () => {
  const [step, setStep] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prevStep) => (prevStep + 1) % 5);
      if (step === 4) {
        setSelectedPlatforms([]);
        setDate('');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step === 1) {
      setSelectedPlatforms(['YouTube', 'TikTok']);
    } else if (step === 2) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <VStack spacing={2}>
            <Text fontSize="sm" mb={2}>Select platforms:</Text>
            <HStack spacing={2}>
              <PlatformTag platform="YouTube" isSelected={false} />
              <PlatformTag platform="TikTok" isSelected={false} />
            </HStack>
          </VStack>
        );
      case 1:
        return (
          <VStack spacing={2}>
            <Text fontSize="sm" mb={2}>Platforms selected:</Text>
            <HStack spacing={2}>
              <PlatformTag platform="YouTube" isSelected={true} />
              <PlatformTag platform="TikTok" isSelected={true} />
            </HStack>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Text fontSize="sm" mt={2}>Select date:</Text>
              <Input
                type="date"
                value=""
                isReadOnly
                bg="whiteAlpha.200"
                borderColor="whiteAlpha.300"
                placeholder="Select date"
              />
            </MotionBox>
          </VStack>
        );
      case 2:
        return (
          <VStack spacing={2}>
            <Text fontSize="sm" mb={2}>Platforms selected:</Text>
            <HStack spacing={2}>
              <PlatformTag platform="YouTube" isSelected={true} />
              <PlatformTag platform="TikTok" isSelected={true} />
            </HStack>
            <Text fontSize="sm" mt={2}>Date selected:</Text>
            <Input
              type="date"
              value={date}
              isReadOnly
              bg="whiteAlpha.200"
              borderColor="whiteAlpha.300"
            />
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Button colorScheme="purple" size="sm" mt={2}>
                Schedule
              </Button>
            </MotionBox>
          </VStack>
        );
      case 3:
        return (
          <VStack spacing={2}>
            <Text fontSize="sm" mb={2}>Platforms selected:</Text>
            <HStack spacing={2}>
              <PlatformTag platform="YouTube" isSelected={true} />
              <PlatformTag platform="TikTok" isSelected={true} />
            </HStack>
            <Text fontSize="sm" mt={2}>Date selected:</Text>
            <Input
              type="date"
              value={date}
              isReadOnly
              bg="whiteAlpha.200"
              borderColor="whiteAlpha.300"
            />
            <Button colorScheme="purple" size="sm" mt={2} isActive={true}>
              Scheduled!
            </Button>
          </VStack>
        );
      case 4:
        return (
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={2}>
              <Icon as={FaCheckCircle} boxSize={12} color="green.500" />
              <Text fontSize="sm" fontWeight="bold" color="green.500">Scheduled!</Text>
              <Text fontSize="xs" color="whiteAlpha.700">Your content will be posted on YouTube and TikTok</Text>
            </VStack>
          </MotionBox>
        );
    }
  };

  return (
    <BentoCard>
      <VStack spacing={4} align="stretch" height="100%">
        <Heading size="md" color="purple.300">Smart Scheduling</Heading>
        <Text fontSize="sm" color="whiteAlpha.800">
          Schedule your content across multiple platforms with ease.
        </Text>
        <Flex direction="column" justify="center" align="center" flex={1}>
          <AnimatePresence mode="wait">
            <MotionBox
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </MotionBox>
          </AnimatePresence>
        </Flex>
      </VStack>
    </BentoCard>
  );
};

const MultilingualVideoCard = () => {
  const [currentLanguage, setCurrentLanguage] = useState(0);
  const languages = [
    { code: 'en', name: 'English', hello: 'Hello' },
    { code: 'es', name: 'Spanish', hello: 'Hola' },
    { code: 'fr', name: 'French', hello: 'Bonjour' },
    { code: 'de', name: 'German', hello: 'Hallo' },
    { code: 'it', name: 'Italian', hello: 'Ciao' },


    { code: 'ar', name: 'Arabic', hello: 'مرحبا' },
    { code: 'ru', name: 'Russian', hello: 'Привет' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLanguage((prev) => (prev + 1) % languages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BentoCard>
      <VStack spacing={4} align="stretch" height="100%">
        <Heading size="md" color="purple.300">Multilingual Videos</Heading>
        <Text fontSize="sm" color="whiteAlpha.800">
          Create videos in 40+ languages with our AI-powered tool.
        </Text>
        <Flex justify="center" align="center" flex={1}>
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentLanguage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              textAlign="center"
            >
              <Text fontSize="4xl" fontWeight="bold" color="white">
                {languages[currentLanguage].hello}
              </Text>
              <Text fontSize="lg" color="whiteAlpha.800" mt={2}>
                {languages[currentLanguage].name}
              </Text>
            </MotionBox>
          </AnimatePresence>
        </Flex>

      </VStack>
    </BentoCard>
  );
};


const StylesCard = () => {
  const [currentStyle, setCurrentStyle] = useState(0);
  const styles = ['Colorful Comics', 'Clipart', 'Cinematic', 'Pixel Art', 'Anime', 'CyberPunk'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStyle((prevStyle) => (prevStyle + 1) % styles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BentoCard>
      <VStack spacing={4} align="stretch" height="100%">
        <Heading size="md" color="purple.300">Dynamic Video Styles</Heading>
        <Text fontSize="sm" color="whiteAlpha.800">
          Choose from a variety of eye-catching styles for your videos.
        </Text>
        <Flex justify="center" align="center" flex={1} overflow="hidden">
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentStyle}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.5 }}
              width="140px"
              height="200px"
              position="relative"
            >
              <Image
                src={`/images/${styles[currentStyle].toLowerCase().replace(/\s/g, '-')}.jpg`}
                alt={styles[currentStyle]}
                objectFit="cover"
                objectPosition="center top"
                width="100%"
                height="100%"
                borderRadius="md"
              />
              <Box
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                bg="rgba(0,0,0,0.7)"
                p={2}
                borderBottomRadius="md"
              >
                <Text fontWeight="bold" textAlign="center" color="white" fontSize="sm">
                  {styles[currentStyle]}
                </Text>
              </Box>
            </MotionBox>
          </AnimatePresence>
        </Flex>

      </VStack>
    </BentoCard>
  );
};

const TestimonialCard = ({ name, image, testimonial, opacity = 1 }) => (
  <Box
    bg="rgba(255,255,255,0.1)"
    p={{ base: 4, md: 6 }}
    borderRadius="xl"
    backdropFilter="blur(10px)"
    width={{ base: "280px", md: "300px" }}
    mx={4}
    opacity={opacity}
    transition="opacity 0.3s"
  >
    <Text fontSize={{ base: "sm", md: "md" }} mb={4} color="whiteAlpha.900">"{testimonial}"</Text>
    <HStack>
      <Avatar size="sm" name={name} src={image} />
      <Text color="blue.300" fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>{name}</Text>
    </HStack>
  </Box>
);


const BentoGrid = ({ onGetStarted }) => (
  <Box py={20} bg="transparent">
    <Container maxW="container.xl">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <AutomateVideosCard />
        <AIScriptGeneratorCard onGetStarted={onGetStarted} />
        <BackgroundVideosCard />
        <MultipurposeVideosCard />
        <StylesCard />
        <AudioVoiceoverCard />
        <AutoSubtitlesCard />
        <SchedulingCard />
        <MultilingualVideoCard />
      </SimpleGrid>
    </Container>
  </Box>
);



function LandingPage() {
  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGetStarted = () => {
    navigate('/signin');
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      await axios.get('https://api.clipzy.ai/current');
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleCTA = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  };

  return (
    <>
      <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DT5Z8NH5R9"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DT5Z8NH5R9');
          `}
        </script>
      </Helmet>
      <Box overflow="hidden" position="relative">
        <SpaceBackground />
        <Navbar isLoggedIn={isLoggedIn} onDashboard={handleCTA} />
        <Container maxW="container.xl" position="relative" zIndex={1} pt={24}>
          <HeroSection onGetStarted={handleCTA} isLoggedIn={isLoggedIn} />
          <Box overflow="hidden" my={10} height="568px">
            <VideoCarousel />
          </Box>
          <Box id="howitworks">
            <MotionBox py={20}>
              <HowItWorks />
            </MotionBox>
          </Box>
          <Box id="features">
            <Heading size="2xl" mb={4} color="white" textAlign="center">Features</Heading>
            <BentoGrid onGetStarted={handleCTA} isLoggedIn={isLoggedIn} />
          </Box>

          
          <Box id="pricing">
            <PricingSection onGetStarted={handleCTA} isLoggedIn={isLoggedIn} />
          </Box>
          <VStack spacing={8} align="center" textAlign="center" py={20}>
            <Heading size="2xl" color="white">Ready to Dominate the Content Game?</Heading>
            <Text fontSize="xl" color="whiteAlpha.800" maxW="2xl">
              Join thousands of content creators who are already using our AI to skyrocket their online presence - all without showing their face!
            </Text>
            <Button
              as={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              colorScheme="purple"
              size="lg"
              px={8}
              onClick={handleCTA}
            >
              {isLoggedIn ? 'Access Dashboard' : 'Start Your Content Revolution'}
            </Button>
          </VStack>
        </Container>
        <Footer />
      </Box>
    </>
  );
}

export default LandingPage;