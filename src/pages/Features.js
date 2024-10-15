import React, { useEffect } from 'react';
import { Box, Container, Heading, SimpleGrid } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { AutomateVideosCard } from './AutomateVideosCard';
import { AIScriptGeneratorCard } from './AIScriptGeneratorCard';
import { BackgroundVideosCard } from './BackgroundVideosCard';
import { MultipurposeVideosCard } from './MultipurposeVideosCard';
import { StylesCard } from './StylesCard';
import { AudioVoiceoverCard } from './AudioVoiceoverCard';
import { AutoSubtitlesCard } from './AutoSubtitlesCard';
import { SchedulingCard } from '../components/SchedulingCard';
import { MultilingualVideoCard } from './MultilingualVideoCard';

const MotionBox = motion(Box);

export const Features = ({ onGetStarted }) => {
  const controls = useAnimation();

  useEffect(() => {
    const animateCards = async () => {
      await controls.start({ opacity: 0, y: 20 });
      await controls.start({ opacity: 1, y: 0, transition: { staggerChildren: 0.1 } });
    };

    animateCards();
  }, [controls]);

  return (
    <Box py={20} bg="transparent">
      <Container maxW="container.xl">
        <Heading size="2xl" mb={8} color="white" textAlign="center">Features</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <MotionBox animate={controls}>
            <AutomateVideosCard />
          </MotionBox>
          <MotionBox animate={controls}>
            <AIScriptGeneratorCard onGetStarted={onGetStarted} />
          </MotionBox>
          <MotionBox animate={controls}>
            <BackgroundVideosCard />
          </MotionBox>
          <MotionBox animate={controls}>
            <MultipurposeVideosCard />
          </MotionBox>
          <MotionBox animate={controls}>
            <StylesCard />
          </MotionBox>
          <MotionBox animate={controls}>
            <AudioVoiceoverCard />
          </MotionBox>
          <MotionBox animate={controls}>
            <AutoSubtitlesCard />
          </MotionBox>
          <MotionBox animate={controls}>
            <SchedulingCard />
          </MotionBox>
          <MotionBox animate={controls}>
            <MultilingualVideoCard />
          </MotionBox>
        </SimpleGrid>
      </Container>
    </Box>
  );
};