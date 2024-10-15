import React, { useState } from 'react';
import { Box, Container, Heading, Text, VStack, Button, Icon, Flex, useDisclosure, Collapse, Progress } from '@chakra-ui/react';
import { FaArrowLeft, FaGavel, FaFileContract, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const TermSection = ({ title, content }) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

  return (
    <Box bg="rgba(255,255,255,0.1)" p={6} borderRadius="xl" backdropFilter="blur(10px)" mb={4}>
      <Flex align="center" justify="space-between" onClick={onToggle} cursor="pointer">
        <Heading size="md" display="flex" alignItems="center">
          <Icon as={FaFileContract} mr={2} />
          {title}
        </Heading>
        <Icon as={isOpen ? FaChevronUp : FaChevronDown} />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Text mt={4}>{content}</Text>
      </Collapse>
    </Box>
  );
};

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [readProgress, setReadProgress] = useState(0);

  const terms = [
    { title: 'Acceptance of Terms', content: 'By using  Clipzy.AI, you agree to these terms and conditions.' },
    { title: 'User Responsibilities', content: 'You are responsible for maintaining the confidentiality of your account.' },
    { title: 'Content Ownership', content: 'You retain ownership of the content you create using our platform.' },
    { title: 'Prohibited Activities', content: 'Users must not engage in any illegal or harmful activities on our platform.' },
    { title: 'Termination', content: 'We reserve the right to terminate accounts that violate our terms.' },
  ];

  const handleScroll = (e) => {
    const element = e.target;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setReadProgress(scrollPercentage);
  };

  return (
    <Box 
      bg="gray.900" 
      minHeight="100vh" 
      color="white"
      backgroundImage="url('/images/space-background.jpg')"
      backgroundSize="cover"
      backgroundAttachment="fixed"
      onScroll={handleScroll}
      overflow="auto"
    >
      <Container maxW="container.xl" py={10}>
        <Button leftIcon={<Icon as={FaArrowLeft} />} onClick={() => navigate(-1)} mb={8} variant="outline">
          Back to Home
        </Button>
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" textAlign="center">Terms and Conditions</Heading>
          <Text textAlign="center" fontSize="xl">Please read our terms carefully before using  Clipzy.AI.</Text>
          
          <Progress value={readProgress} colorScheme="purple" size="sm" mb={4} />
          
          {terms.map((term, index) => (
            <TermSection key={index} title={term.title} content={term.content} />
          ))}

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
           
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;