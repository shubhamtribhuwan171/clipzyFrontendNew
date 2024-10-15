import React, { useState } from 'react';
import { Box, Container, Heading, Text, VStack, Button, Icon, Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FaArrowLeft, FaChevronUp,FaChevronDown,FaQuestionCircle, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MotionBox
      layout
      bg="rgba(255,255,255,0.1)"
      p={6}
      borderRadius="xl"
      backdropFilter="blur(10px)"
      mb={4}
      onClick={() => setIsOpen(!isOpen)}
      cursor="pointer"
    >
      <Flex align="center" justify="space-between">
        <Heading size="md" display="flex" alignItems="center">
          <Icon as={FaQuestionCircle} mr={2} />
          {question}
        </Heading>
        <Icon as={isOpen ? FaChevronUp : FaChevronDown} />
      </Flex>
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            mt={4}
          >
            <Text>{answer}</Text>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

const FAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    { question: 'What is Clipzy.AI?', answer: 'Clipzy.AI is an AI-powered platform for creating faceless content for social media.' },
    { question: 'How does it work?', answer: 'Our AI generates scripts, visuals, and audio based on your input and preferences.' },
    { question: 'Is my content private?', answer: 'Yes, your content is private and only accessible by you unless you choose to share it.' },
    { question: 'Can I use the content commercially?', answer: 'Yes, you have full rights to use the content you create for commercial purposes.' },
    { question: 'What platforms are supported?', answer: 'We currently support YouTube, TikTok, and Instagram.' },
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box 
      bg="gray.900" 
      minHeight="100vh" 
      color="white"
      backgroundImage="url('/images/space-background.jpg')"
      backgroundSize="cover"
      backgroundAttachment="fixed"
    >
      <Container maxW="container.xl" py={10}>
        <Button leftIcon={<Icon as={FaArrowLeft} />} onClick={() => navigate(-1)} mb={8} variant="outline">
          Back to Home
        </Button>
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" textAlign="center">Frequently Asked Questions</Heading>
          <Text textAlign="center" fontSize="xl">Find answers to common questions about Clipzy.AI.</Text>
          
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search FAQs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="whiteAlpha.200"
              border="none"
              _focus={{ bg: "whiteAlpha.300" }}
            />
          </InputGroup>

          <AnimatePresence>
            {filteredFAQs.map((faq, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FAQItem question={faq.question} answer={faq.answer} />
              </MotionBox>
            ))}
          </AnimatePresence>

          {filteredFAQs.length === 0 && (
            <Text textAlign="center" fontSize="lg" mt={8}>
              No matching questions found. Please try a different search term.
            </Text>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default FAQ;