import React from 'react';
import { Box, VStack, Heading, Text, SimpleGrid, List, ListItem, ListIcon, Button, Badge } from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PricingCard = ({ title, price, features, isPopular, onGetStarted }) => (
  <MotionBox
    bg="rgba(255, 255, 255, 0.1)"
    borderRadius="xl"
    border="1px solid rgba(255, 255, 255, 0.2)"
    p={6}
    textAlign="center"
    position="relative"
    backdropFilter="blur(10px)"
    boxShadow="xl"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
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
    <VStack spacing={4}>
      <Heading size="lg" color="white">{title}</Heading>
      <Text fontSize="4xl" fontWeight="bold" color="purple.300">
        ${price}<Text as="span" fontSize="sm" fontWeight="normal">/month</Text>
      </Text>
      <List spacing={3} textAlign="start" px={12}>
        {features.map((feature, index) => (
          <ListItem key={index}>
            <ListIcon as={FaCheck} color="green.500" />
            {feature}
          </ListItem>
        ))}
      </List>
      <Button
        colorScheme={isPopular ? "purple" : "whiteAlpha"}
        size="lg"
        w="full"
        mt={4}
        onClick={isPopular ? onGetStarted : undefined}
      >
        Get Started
      </Button>
    </VStack>
  </MotionBox>
);

export const Pricing = ({ onGetStarted }) => (
  <Box py={20}>
    <VStack spacing={8}>
      <Heading size="2xl" color="white">Choose Your Plan</Heading>
      <Text fontSize="xl" color="whiteAlpha.800" textAlign="center" maxW="2xl">
        Select the perfect plan for your content creation needs. All plans include our core AI-powered features.
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="full" pt={10}>
        <PricingCard
          title="Starter"
          price={29}
          features={[
            "5 AI-generated videos per month",
            "Basic customization options",
            "720p video quality",
            "Email support"
          ]}
        />
        <PricingCard
          title="Pro"
          price={79}
          features={[
            "20 AI-generated videos per month",
            "Advanced customization options",
            "1080p video quality",
            "Priority email support",
            "Custom intro and outro"
          ]}
          isPopular
          onGetStarted={onGetStarted}
        />
        <PricingCard
          title="Enterprise"
          price={199}
          features={[
            "Unlimited AI-generated videos",
            "Full customization suite",
            "4K video quality",
            "24/7 priority support",
            "Custom branding",
            "API access"
          ]}
        />
      </SimpleGrid>
    </VStack>
  </Box>
);