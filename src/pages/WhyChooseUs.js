import React from 'react';
import { VStack, Heading, SimpleGrid, Icon, Text, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGlobe, FaMagic, FaChartLine, FaClock, FaStar, FaTiktok } from 'react-icons/fa';

const MotionBox = motion(Box);

const BenefitCard = ({ icon, title, description }) => (
  <MotionBox
    bg="rgba(255,255,255,0.1)"
    p={6}
    borderRadius="lg"
    boxShadow="md"
    backdropFilter="blur(10px)"
    border="1px solid rgba(255,255,255,0.2)"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    <Icon as={icon} w={10} h={10} color="purple.400" mb={4} />
    <Heading size="md" mb={4} color="white">{title}</Heading>
    <Text color="whiteAlpha.800">{description}</Text>
  </MotionBox>
);

export const WhyChooseUs = () => (
  <VStack spacing={12} py={20}>
    <Heading mb={4} size="2xl" color="white">Why Choose Faceless Videos?</Heading>
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="100%">
      <BenefitCard
        icon={FaGlobe}
        title="Privacy and Anonymity"
        description="Maintain your personal privacy while creating engaging content for a global audience."
      />
      <BenefitCard
        icon={FaMagic}
        title="Focus on Content Quality"
        description="Let your ideas shine without worrying about personal appearance or camera presence."
      />
      <BenefitCard
        icon={FaChartLine}
        title="Scalable Content Creation"
        description="Easily produce videos for multiple niches and expand your online presence."
      />
      <BenefitCard
        icon={FaClock}
        title="Time-Efficient"
        description="Save hours on makeup, lighting, and camera setup. Focus on what matters most - your content."
      />
      <BenefitCard
        icon={FaStar}
        title="Overcome Stage Fright"
        description="Create professional-quality videos without the stress of being on camera."
      />
      <BenefitCard
        icon={FaTiktok}
        title="Platform Versatility"
        description="Seamlessly create content optimized for various platforms like YouTube, TikTok, and more."
      />
    </SimpleGrid>
  </VStack>
);