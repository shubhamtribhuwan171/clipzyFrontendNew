import React from 'react';
import { VStack, Heading, SimpleGrid, Text, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const SuccessStoryCard = ({ name, platform, achievement, views, subscribers, earnings }) => (
  <MotionBox
    bg="rgba(255,255,255,0.1)"
    p={6}
    borderRadius="lg"
    boxShadow="md"
    backdropFilter="blur(10px)"
    border="1px solid rgba(255,255,255,0.2)"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <Heading size="md" mb={2} color="white">{name}</Heading>
    <Text color="purple.300" fontWeight="bold" mb={4}>{platform}</Text>
    <Text color="whiteAlpha.900" mb={4}>{achievement}</Text>
    <SimpleGrid columns={2} spacing={4}>
      <Box>
        <Text color="whiteAlpha.700">Views</Text>
        <Text color="white" fontWeight="bold">{views}</Text>
      </Box>
      <Box>
        <Text color="whiteAlpha.700">Subscribers</Text>
        <Text color="white" fontWeight="bold">{subscribers}</Text>
      </Box>
      <Box gridColumn="span 2">
        <Text color="whiteAlpha.700">Estimated Earnings</Text>
        <Text color="green.300" fontWeight="bold">{earnings}</Text>
      </Box>
    </SimpleGrid>
  </MotionBox>
);

export const SuccessStories = () => (
  <VStack spacing={12} py={20}>
    <Heading size="2xl" color="white">Success Stories</Heading>
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="100%">
      <SuccessStoryCard
        name="Alex's Tech Reviews"
        platform="YouTube"
        achievement="Gained 100K subscribers in 3 months"
        views="2.5M+"
        subscribers="150K"
        earnings="$5,000 - $8,000 / month"
      />
      <SuccessStoryCard
        name="Sarah's Daily Tips"
        platform="TikTok"
        achievement="Video went viral with 5M views"
        views="10M+"
        subscribers="500K"
        earnings="$3,000 - $5,000 / month"
      />
      <SuccessStoryCard
        name="TeamTech Insights"
        platform="YouTube & TikTok"
        achievement="Increased engagement by 300%"
        views="5M+"
        subscribers="250K"
        earnings="$7,000 - $10,000 / month"
      />
    </SimpleGrid>
  </VStack>
);