import React from 'react';
import {
  Box, Container, VStack, Heading, Text, useColorModeValue,
  Flex, Icon, Button, SimpleGrid, Stat, StatLabel, StatNumber,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  useTheme, Image,
} from '@chakra-ui/react';
import { FaArrowLeft, FaCheckCircle, FaCalendarAlt, FaClock, FaArrowRight, FaChartLine, FaUsers, FaDollarSign } from 'react-icons/fa';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionFlex = motion(Flex);

const Affiliate = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { scrollYProgress } = useViewportScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const statBorderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const stats = [
    { label: 'Average Earnings', value: '$1,200', icon: FaDollarSign },
    { label: 'Active Affiliates', value: '5,000+', icon: FaUsers },
    { label: 'Conversion Rate', value: '12%', icon: FaChartLine },
  ];

  const faqs = [
    { 
      question: "How does the affiliate program work?",
      answer: "Our affiliate program allows you to earn commissions by referring new users to our platform. You'll receive a unique referral link to share, and when someone signs up using your link and makes a purchase, you'll earn a percentage of their payment."
    },
    {
      question: "What is the commission rate?",
      answer: "Our standard commission rate is 20% of the referred user's first payment. For high-performing affiliates, we offer increased rates up to 30%."
    },
    {
      question: "How and when do I get paid?",
      answer: "Payments are made monthly via PayPal or bank transfer. You need to have a minimum balance of $50 to receive a payout. Payments are processed on the 1st of each month for the previous month's earnings."
    },
    {
      question: "Are there any costs to join the affiliate program?",
      answer: "No, joining our affiliate program is completely free. There are no hidden fees or charges."
    }
  ];

  return (
    <Box minHeight="100vh" bg={bgColor} position="relative">
      <MotionBox
        position="fixed"
        top={0}
        left={0}
        right={0}
        height="100vh"
        backgroundImage="url('/images/affiliate-bg.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        style={{ opacity }}
        zIndex={-1}
      />
      <Container maxW="container.xl" py={20}>
        <Button
          leftIcon={<FaArrowLeft />}
          position="absolute"
          top="4"
          left="4"
          onClick={() => navigate('/')}
          colorScheme="purple"
          variant="solid"
          zIndex="docked"
        >
          Back to Home
        </Button>

        <VStack spacing={16} align="stretch">
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading size="4xl" mb={4} textAlign="center" bgGradient={`linear(to-r, ${theme.colors.purple[400]}, ${theme.colors.pink[400]})`} bgClip="text">
              UNLOCK YOUR EARNING POTENTIAL
            </Heading>
            <Text fontSize="2xl" textAlign="center" mb={8} color={textColor}>
              Join the revolution in video creation technology.<br />
              Transform your influence into a thriving income stream.
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Stat
                  px={4}
                  py={5}
                  shadow="xl"
                  border="1px solid"
                  borderColor={statBorderColor}
                  rounded="lg"
                  bg={cardBg}
                >
                  <Flex justifyContent="space-between">
                    <Box pl={2}>
                      <StatLabel fontWeight="medium" isTruncated>
                        {stat.label}
                      </StatLabel>
                      <StatNumber fontSize="3xl" fontWeight="bold">
                        {stat.value}
                      </StatNumber>
                    </Box>
                    <Box
                      my="auto"
                      color={accentColor}
                      alignContent="center"
                    >
                      <Icon as={stat.icon} w={8} h={8} />
                    </Box>
                  </Flex>
                </Stat>
              </MotionBox>
            ))}
          </SimpleGrid>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box textAlign="center" bg={cardBg} p={10} borderRadius="xl" boxShadow="2xl">
              <Heading size="xl" mb={6}>Your Gateway to Financial Freedom</Heading>
              <Text fontSize="lg" mb={8} color={textColor}>
                Join now and start your journey towards unlimited earnings!
              </Text>
              <Button
                size="lg"
                colorScheme="purple"
                rightIcon={<FaArrowRight />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                Become an Affiliate Today
              </Button>
            </Box>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box bg={cardBg} p={10} borderRadius="xl" boxShadow="2xl">
              <Heading size="xl" mb={8} textAlign="center">Frequently Asked Questions</Heading>
              <Accordion allowMultiple>
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} border="none">
                    <AccordionButton _expanded={{ bg: accentColor, color: 'white' }}>
                      <Box flex="1" textAlign="left" fontWeight="semibold">
                        {faq.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {faq.answer}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </MotionBox>

          <MotionFlex
            justify="center"
            align="center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <MotionText
              fontSize="2xl"
              fontWeight="bold"
              color={accentColor}
              display="inline-flex"
              alignItems="center"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Start your affiliate journey today
              <Icon as={FaArrowRight} ml={2} />
            </MotionText>
          </MotionFlex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Affiliate;