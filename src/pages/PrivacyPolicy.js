import React, { useState } from 'react';
import { Box, Container, Heading, Text, VStack, Button, Icon, List, ListItem, ListIcon, Flex, useDisclosure, Collapse, ScaleFade } from '@chakra-ui/react';
import { FaArrowLeft, FaShieldAlt, FaUserSecret, FaLock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PolicySection = ({ title, icon, children }) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

  return (
    <Box bg="rgba(255,255,255,0.1)" p={6} borderRadius="xl" backdropFilter="blur(10px)" mb={4}>
      <Flex align="center" justify="space-between" onClick={onToggle} cursor="pointer">
        <Heading size="md" display="flex" alignItems="center">
          <Icon as={icon} mr={2} />
          {title}
        </Heading>
        <Icon as={isOpen ? FaChevronUp : FaChevronDown} />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box mt={4}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

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
          <Heading size="2xl" textAlign="center">Privacy Policy</Heading>
          <Text textAlign="center" fontSize="xl">Your privacy is our top priority. Learn how we protect your data.</Text>
          
          <PolicySection title="Information We Collect" icon={FaUserSecret}>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaLock} color="green.500" />
                Personal information you provide (e.g., name, email)
              </ListItem>
              <ListItem>
                <ListIcon as={FaLock} color="green.500" />
                Usage data and analytics
              </ListItem>
              <ListItem>
                <ListIcon as={FaLock} color="green.500" />
                Content you create using our platform
              </ListItem>
            </List>
          </PolicySection>

          <PolicySection title="How We Use Your Information" icon={FaShieldAlt}>
            <Text>We use your information to:</Text>
            <List spacing={3} mt={2}>
              <ListItem>Provide and improve our services</ListItem>
              <ListItem>Personalize your experience</ListItem>
              <ListItem>Communicate with you about our products and updates</ListItem>
            </List>
          </PolicySection>

          <PolicySection title="Data Security" icon={FaLock}>
            <Text>We implement industry-standard security measures to protect your data, including:</Text>
            <List spacing={3} mt={2}>
              <ListItem>Encryption of sensitive information</ListItem>
              <ListItem>Regular security audits</ListItem>
              <ListItem>Strict access controls for our employees</ListItem>
            </List>
          </PolicySection>

        </VStack>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;