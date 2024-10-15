import React, { useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Icon,
  Button,
  useColorModeValue,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { FaEnvelope, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const Contact = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = "purple.500";
  
  const controls = useAnimation();

  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.2 }
    }));
  }, [controls]);

  return (
    <Box bg={bgColor} minHeight="100vh" position="relative">
      <Button
        leftIcon={<FaArrowLeft />}
        position="absolute"
        top="4"
        left="4"
        onClick={() => navigate('/')}
        colorScheme="purple"
        variant="ghost"
      >
        Back to Home
      </Button>
      
      <Container maxW="container.xl" pt={20}>
        <VStack spacing={12} align="center">
          <MotionBox
            initial={{ opacity: 0, y: -50 }}
            animate={controls}
            custom={0}
            textAlign="center"
          >
            <Heading as="h1" size="2xl" color={textColor} mb={4}>
              Let's Connect
            </Heading>
            <Text color={textColor} fontSize="xl">
              Have a question or want to learn more about Clipzy.AI?
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.5 }}
            animate={controls}
            custom={1}
            width="100%"
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="2xl"
              overflow="hidden"
            >
              <VStack
                spacing={8}
                p={10}
                align="flex-start"
                flex={1}
              >
                <Icon as={FaEnvelope} w={12} h={12} color={accentColor} />
                <Heading size="lg" color={textColor}>
                  Email Us
                </Heading>
                <Text color={textColor} fontSize="xl" fontWeight="bold">
                  solutionnyx@gmail.com
                </Text>
                <Text color={textColor}>
                  We're excited to hear from you! Drop us an email and we'll get back to you faster than our AI generates videos.
                </Text>
                <Button
                  as="a"
                  href="mailto:solutionnyx@gmail.com"
                  colorScheme="purple"
                  size="lg"
                  leftIcon={<FaEnvelope />}
                >
                  Send us an email
                </Button>
              </VStack>

              <Divider orientation="vertical" />

              <VStack
                spacing={8}
                p={10}
                align="flex-start"
                flex={1}
                bg={useColorModeValue('gray.50', 'gray.700')}
              >
                <Icon as={FaMapMarkerAlt} w={12} h={12} color={accentColor} />
                <Heading size="lg" color={textColor}>
                  Visit Us
                </Heading>
                <Text color={textColor} fontSize="xl" fontWeight="bold">
                  R. K. Paper Products
                </Text>
                <Text color={textColor}>
                  A 23/3, R K PLASTRONICS, MIDC AREA, JALNA, Jalna, Maharashtra, 431203
                </Text>
              </VStack>
            </Flex>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            custom={2}
          >
            <Text color={textColor} fontSize="lg" textAlign="center" maxW="2xl">
              At Clipzy.AI, we're not just creating videos - we're revolutionizing content creation. 
              Let's discuss how we can help you make an impact without showing your face!
            </Text>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default Contact;