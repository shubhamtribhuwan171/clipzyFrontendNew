// HomePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  useColorMode,
  Text,
  Flex,
  useColorModeValue,
  AspectRatio,
  Container,
  useBreakpointValue,
  Badge,
} from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import BottomTabBar from '../components/BottomTabBar';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

import {
  RedditOutlined,
  MessageOutlined,
  RobotOutlined,
  QuestionCircleOutlined,
  SolutionOutlined,
  EditOutlined,
  AudioOutlined,
  PictureOutlined,
  SmileOutlined, // Import the new icon
} from '@ant-design/icons';
import { FiColumns } from 'react-icons/fi';

const MotionBox = motion(Box);
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function ContentCard({ title, description, gradient, onClick, icon: Icon, comingSoon }) {
  const textColor = 'white';
  const cardBg = useColorModeValue('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.2)');
  const shadowColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <MotionBox
      as="button"
      onClick={onClick}
      borderRadius="lg"
      overflow="hidden"
      position="relative"
      width="100%"
      height="100%"
      bg={cardBg}
      boxShadow={`0 4px 6px ${shadowColor}`}
      _hover={{ transform: 'translateY(-5px)', boxShadow: `0 6px 8px ${shadowColor}` }}
      transition="all 0.3s"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AspectRatio ratio={1}>
        <Box position="relative" width="100%" height="100%" overflow="hidden">
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg={gradient}
            filter="blur(20px)"
            transform="scale(1.1)"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg={comingSoon ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)'}
          />
          <Flex
            position="relative"
            height="100%"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={isMobile ? 3 : 6}
            textAlign="center"
          >
            <Icon
              style={{
                fontSize: isMobile ? '2rem' : '3rem',
                color: textColor,
                marginBottom: isMobile ? '0.5rem' : '1rem',
              }}
            />
            <Heading as="h3" size={isMobile ? 'sm' : 'md'} mb={isMobile ? 1 : 2} color={textColor}>
              {title}
            </Heading>
            <Text color={textColor} fontSize={isMobile ? 'xs' : 'sm'}>
              {description}
            </Text>
            {comingSoon && (
              isMobile ? (
                <Badge
                  colorScheme="yellow"
                  position="absolute"
                  top="2"
                  right="2"
                  fontSize="xs"
                >
                  Coming Soon
                </Badge>
              ) : (
                <Text
                  color="yellow.300"
                  fontWeight="bold"
                  fontSize="lg"
                  mt={4}
                  textTransform="uppercase"
                >
                  Coming Soon
                </Text>
              )
            )}
          </Flex>
        </Box>
      </AspectRatio>
    </MotionBox>
  );
}

function HomePage() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('Home');

  const handleSidebarItemClick = (item) => {
    setSelectedSidebarItem(item === selectedSidebarItem ? null : item);
  };

  const bgColor = useColorModeValue('gray.50', '#121212');
  const headingColor = useColorModeValue('gray.800', 'white');

  const cards = [
    {
      title: 'AI Video',
      icon: RobotOutlined,
      description: 'Generate custom AI-powered videos',
      gradient:
        'radial-gradient(circle at 30% 107%, #667EEA 0%, #764BA2 5%, #6B8DD6 45%, #8E37D7 60%, #B721FF 90%)',
      path: '/ai-video-creation',
    },
    {
      title: 'Generate Scripts',
      icon: EditOutlined,
      description: 'Create and manage AI-generated scripts',
      gradient:
        'radial-gradient(circle at 30% 107%, #FF6B6B 0%, #FCA5A5 25%, #FCD34D 50%, #4ADE80 75%, #60A5FA 100%)',
      path: '/generate-scripts',
      comingSoon: true,
    },
    {
      title: 'Generate Voiceovers',
      icon: AudioOutlined,
      description: 'Create AI-powered voiceovers from scripts',
      gradient:
        'radial-gradient(circle at 30% 107%, #60A5FA 0%, #3B82F6 25%, #8B5CF6 50%, #EC4899 75%, #F43F5E 100%)',
      path: '/generate-voiceovers',
      comingSoon: true,
    },
    {
      title: 'Generate Images',
      icon: PictureOutlined,
      description: 'Create AI-generated images for your content',
      gradient:
        'radial-gradient(circle at 30% 107%, #14B8A6 0%, #0EA5E9 25%, #8B5CF6 50%, #D946EF 75%, #F43F5E 100%)',
      path: '/generate-images',
      comingSoon: true,
    },
    {
      title: 'Reddit Story',
      icon: RedditOutlined,
      description: 'Craft viral Reddit posts and stories',
      gradient:
        'radial-gradient(circle at 30% 107%, #FF4500 0%, #FF8717 5%, #FF4500 45%, #FFA500 60%, #FF8C00 90%)',
      path: '/reddit-story',
      comingSoon: true,
    },
    {
      title: 'Quiz Creator',
      icon: QuestionCircleOutlined,
      description: 'Design engaging interactive quizzes',
      gradient:
        'radial-gradient(circle at 30% 107%, #43E97B 0%, #38F9D7 5%, #38F9D7 45%, #FA709A 60%, #FEE140 90%)',
      path: '/quiz',
    },
    {
      title: 'Would You Rather',
      icon: SolutionOutlined,
      description: 'Generate thought-provoking questions',
      gradient:
        'radial-gradient(circle at 30% 107%, #25D366 0%, #128C7E 5%, #075E54 45%, #34B7F1 60%, #00A884 90%)',
      path: '/would-you-rather',
    },
    {
      title: 'Fake Chat Video',
      icon: MessageOutlined,
      description: 'Create realistic chat conversations',
      gradient:
        'radial-gradient(circle at 30% 107%, #30CFD0 0%, #330867 5%, #30CFD0 45%, #763506 60%, #FFC837 90%)',
      path: '/fake-chat-video',
      comingSoon: true,
    },
    {
      title: 'Split Screen',
      icon: FiColumns,
      description: 'Create dynamic split-screen videos',
      gradient:
        'radial-gradient(circle at 30% 107%, #F093FB 0%, #F5576C 5%, #F093FB 45%, #4FACFE 60%, #00F2FE 90%)',
      path: '/split-screen',
    },
    {
      title: 'Guess the Emoji',
      icon: SmileOutlined,
      description: 'Combine emojis to guess the word',
      gradient:
        'radial-gradient(circle at 30% 107%, #FFD700 0%, #FFA500 25%, #FF4500 50%, #DC143C 75%, #B22222 100%)',
      path: '/guess-the-emoji',
    },
  ];

  // Sort the cards, placing "Coming Soon" items at the bottom
  const sortedCards = [...cards].sort((a, b) => {
    if (a.comingSoon && !b.comingSoon) return 1;
    if (!a.comingSoon && b.comingSoon) return -1;
    return 0;
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex minHeight="100vh" bg={bgColor}>
      {!isMobile && (
        <Box position="fixed" top={0} left={0} bottom={0} width="250px" zIndex={1000}>
          <Sidebar selectedItem={selectedSidebarItem} onItemClick={handleSidebarItemClick} />
        </Box>
      )}
      <Box flex={1} ml={!isMobile ? '250px' : 0} overflowY="auto" pb={isMobile ? 16 : 0}>
        <Container maxW="container.xl" py={10}>
          <VStack spacing={8} align="stretch">
            <Box>
              <Heading as="h1" size="2xl" color={headingColor} mb={2}>
                AI-Powered Content Studio
              </Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
                Create captivating content with our suite of AI tools
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 2, sm: 2, lg: 3 }} spacing={8}>
              {sortedCards.map((card, index) => (
                <ContentCard key={index} {...card} onClick={() => navigate(card.path)} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      {isMobile && <BottomTabBar />}
    </Flex>
  );
}

export default HomePage;
