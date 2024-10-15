import React from 'react';
import { Box, Container, Heading, Text, VStack, Button, Icon, SimpleGrid, Flex, Image, useColorModeValue, Divider } from '@chakra-ui/react';
import { FaArrowLeft, FaRobot, FaCode, FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const FeatureCard = ({ icon, title, description }) => (
  <MotionBox
    whileHover={{ scale: 1.05, boxShadow: "2xl" }}
    whileTap={{ scale: 0.95 }}
    bg={useColorModeValue('white', 'gray.800')}
    p={6}
    borderRadius="xl"
    boxShadow="lg"
    transition="all 0.3s"
    border="1px solid"
    borderColor={useColorModeValue('gray.200', 'gray.700')}
  >
    <Flex direction="column" align="center" textAlign="center">
      <Icon as={icon} w={12} h={12} color="purple.500" mb={4} />
      <Heading size="md" mb={3} fontWeight="bold">{title}</Heading>
      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>{description}</Text>
    </Flex>
  </MotionBox>
);

const AboutUs = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = "purple.500";

  return (
    <Box bg={bgColor} minHeight="100vh" color={textColor}>
      <Container maxW="container.xl" py={20}>
        <Button
          leftIcon={<Icon as={FaArrowLeft} />}
          onClick={() => navigate(-1)}
          mb={12}
          variant="outline"
          borderColor={accentColor}
          color={accentColor}
          _hover={{ bg: accentColor, color: 'white' }}
        >
          Back to Home
        </Button>

        <VStack spacing={20} align="stretch">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading size="3xl" textAlign="center" mb={6} bgGradient={`linear(to-r, ${accentColor}, purple.300)`} bgClip="text">
              About Clipzy.AI
            </Heading>
            <Text fontSize="xl" textAlign="center" maxW="2xl" mx="auto" color={useColorModeValue('gray.600', 'gray.400')}>
              Revolutionizing content creation with AI-powered solutions that empower creators to produce exceptional, engaging content efficiently.
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <FeatureCard
              icon={FaRobot}
              title="AI-Driven Innovation"
              description="Leveraging cutting-edge AI to create powerful, user-friendly tools."
            />
            <FeatureCard
              icon={FaCode}
              title="Expert Development"
              description="Our skilled team brings years of experience in crafting robust software solutions."
            />
            <FeatureCard
              icon={FaLightbulb}
              title="Creative Solutions"
              description="Combining technical expertise with creative thinking to solve complex problems."
            />
            <FeatureCard
              icon={FaUsers}
              title="User-Centric Approach"
              description="Focusing on intuitive design and seamless user experiences."
            />
          </SimpleGrid>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box bg={cardBg} p={10} borderRadius="2xl" boxShadow="2xl" border="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <Heading size="xl" mb={6} color={accentColor}>Our Mission</Heading>
              <Text fontSize="lg" mb={6} lineHeight="tall">
                At Clipzy.AI, we're on a mission to revolutionize content creation through the power of AI. We believe in making advanced technology accessible to creators of all levels, empowering them to produce high-quality, engaging content efficiently.
              </Text>
              <Text fontSize="lg" lineHeight="tall">
                Our flagship product, the AI-powered video generation platform, is just the beginning. We're constantly innovating and expanding our suite of tools to meet the evolving needs of digital content creators.
              </Text>
            </Box>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between" bg={cardBg} p={10} borderRadius="2xl" boxShadow="2xl" border="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <Box flex={1} mr={{ base: 0, lg: 12 }} mb={{ base: 10, lg: 0 }}>
                <Heading size="xl" mb={6} color={accentColor}>Company Information</Heading>
                <VStack align="start" spacing={4}>
                  <Text fontSize="lg" fontWeight="bold">R. K. Paper Products</Text>
                  <Text>Address: A 23/3, R K PLASTRONICS, MIDC AREA, JALNA, Jalna, Maharashtra, 431203</Text>
                </VStack>
              </Box>

            </Flex>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Box bg={cardBg} p={10} borderRadius="2xl" boxShadow="2xl" border="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
                <Box flex={1} mr={{ base: 0, md: 8 }} mb={{ base: 8, md: 0 }}>
                  <Heading size="xl" mb={6} color={accentColor}>Join Us on Our Journey</Heading>
                  <Text fontSize="lg" mb={6} lineHeight="tall">
                    As we continue to grow and innovate, we're always looking for passionate individuals to join our team. Whether you're a developer, AI enthusiast, or creative thinker, there might be a place for you at Clipzy.AI.
                  </Text>
                </Box>

              </Flex>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default AboutUs;