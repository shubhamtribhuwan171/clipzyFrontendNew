import React from 'react';
import {
  Box, Container, VStack, Heading, Text, Button, useColorModeValue,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  List, ListItem, ListIcon, Icon, Flex, Circle
} from '@chakra-ui/react';
import { FaArrowLeft, FaCheckCircle, FaClock, FaExclamationTriangle, FaQuestionCircle, FaShieldAlt } from 'react-icons/fa';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionCircle = motion(Circle);

const RefundPolicy = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useViewportScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const accordionBg = useColorModeValue('white', 'gray.800');
  const accordionHoverBg = useColorModeValue('purple.50', 'purple.900');

  const policies = [
    {
      title: "3-Day Satisfaction Assurance",
      content: "We offer a 3-day satisfaction assurance on all our plans. If our service doesn't meet your expectations, you can request a full refund within 3 days of your purchase, no questions asked.",
      icon: FaClock
    },
    {
      title: "Eligibility for Refund",
      content: "To be eligible for a refund, you must have used our service for less than 50% of your plan's duration or generated less than 3 videos, whichever comes first.",
      icon: FaCheckCircle
    },
    {
      title: "Refund Process",
      content: "To request a refund, please contact our support team. Once approved, refunds will be processed within 3-5 business days.",
      icon: FaQuestionCircle
    },
    {
      title: "Exceptions",
      content: "Refunds may not be available for custom enterprise plans or if there's evidence of abuse of our service or violation of our terms.",
      icon: FaExclamationTriangle
    }
  ];

  return (
    <Box bg={bgColor} minHeight="100vh" position="relative" overflow="hidden">
      <Button
        leftIcon={<FaArrowLeft />}
        position="absolute"
        top="4"
        left="4"
        onClick={() => navigate('/')}
        colorScheme="purple"
        variant="ghost"
        zIndex="docked"
      >
        Back to Home
      </Button>
      
      <MotionCircle
        size="400px"
        bg="purple.500"
        position="absolute"
        top="-200px"
        right="-200px"
        opacity={0.1}
        style={{ rotate }}
      />

      <Container maxW="container.lg" pt={20}>
        <VStack spacing={12} align="stretch">
          <MotionBox
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading size="2xl" textAlign="center" mb={4}>Refund Policy</Heading>
            <Text fontSize="xl" textAlign="center" color={textColor}>
              At Clipzy.AI, your satisfaction is our priority. We're confident in our service and offer a swift, hassle-free refund process:
            </Text>
          </MotionBox>

          <MotionFlex
            justify="center"
            align="center"
            style={{ scale }}
          >
            <Icon as={FaShieldAlt} boxSize={20} color="purple.500" />
          </MotionFlex>

          <Accordion allowMultiple>
            {policies.map((policy, index) => (
              <AccordionItem key={index} border="none" mb={4}>
                <MotionBox
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionButton
                    bg={accordionBg}
                    p={6}
                    borderRadius="lg"
                    _hover={{ bg: accordionHoverBg }}
                  >
                    <Box flex="1" textAlign="left">
                      <Heading size="md" display="flex" alignItems="center">
                        <MotionBox
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon as={policy.icon} mr={4} color="purple.500" />
                        </MotionBox>
                        {policy.title}
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </MotionBox>
                <AccordionPanel pb={4}>
                  <Text color={textColor}>{policy.content}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>

          <MotionBox
            bg={accordionBg}
            p={8}
            borderRadius="xl"
            boxShadow="xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Heading size="lg" mb={4}>How to Request a Refund</Heading>
            <List spacing={3}>
              {[
                "Contact our support team via email or chat",
                "Provide your account details and reason for refund",
                "Our team will review your request within 72 hours",
                "If approved, refund will be processed to your original payment method"
              ].map((step, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <ListItem display="flex" alignItems="center">
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    {step}
                  </ListItem>
                </MotionBox>
              ))}
            </List>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Text fontSize="sm" textAlign="center" color={textColor}>
              This refund policy reflects our commitment to customer satisfaction and confidence in our service. If you have any questions, please don't hesitate to contact our support team.
            </Text>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default RefundPolicy;