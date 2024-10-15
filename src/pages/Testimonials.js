import React from 'react';
import { Box, Heading, Text, VStack, HStack, Avatar, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ name, image, testimonial, opacity = 1 }) => (
  <Box
    bg="rgba(255,255,255,0.1)"
    p={6}
    borderRadius="xl"
    backdropFilter="blur(10px)"
    width="300px"
    mx={4}
    opacity={opacity}
    transition="opacity 0.3s"
  >
    <Text fontSize="sm" mb={4} color="whiteAlpha.900">"{testimonial}"</Text>
    <HStack>
      <Avatar size="sm" name={name} src={image} />
      <Text color="blue.300" fontWeight="bold">{name}</Text>
    </HStack>
  </Box>
);

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Natasha Jackson",
      image: "/path/to/natasha.jpg",
      testimonial: "I had no idea how much fun creating videos just by chatting or talking. Also, Calvin is really cool guy."
    },
    {
      name: "James Bearman",
      image: "/path/to/james.jpg",
      testimonial: "This app has revolutionized how I create short video content. It's just enjoyable to use and better than I expected."
    },
    // Add more testimonials...
  ];

  return (
    <Box py={20} position="relative" overflow="hidden">
      <Heading size="2xl" mb={10} textAlign="center" color="white" fontWeight="bold">
        Hear it from our users
      </Heading>

      <Flex justify="space-around" mb={16}>
        <VStack>
          <Text fontSize="6xl" fontWeight="bold" color="white">1000+</Text>
          <Text color="whiteAlpha.900">Active users</Text>
        </VStack>
        <VStack>
          <Text fontSize="6xl" fontWeight="bold" color="white">10k+</Text>
          <Text color="whiteAlpha.900">Videos created</Text>
        </VStack>
        <VStack>
          <Text fontSize="6xl" fontWeight="bold" color="white">145</Text>
          <Text color="whiteAlpha.900">Countries</Text>
        </VStack>
      </Flex>

      <Box position="relative" height="300px" overflow="hidden">
        <motion.div
          animate={{ x: [0, -1500] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          style={{ display: 'flex', position: 'absolute' }}
        >
          {testimonials.concat(testimonials).concat(testimonials).map((t, i) => (
            <TestimonialCard
              key={i}
              {...t}
              opacity={i % testimonials.length === 1 ? 1 : 0.5}
            />
          ))}
        </motion.div>
      </Box>
    </Box>
  );
};