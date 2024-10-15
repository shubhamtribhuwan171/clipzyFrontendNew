import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Button,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Badge,
} from '@chakra-ui/react';
import { FiSearch, FiMail, FiMessageSquare, FiPhone, FiFileText, FiHelpCircle } from 'react-icons/fi';

const faqData = [
  {
    question: "How do I create my first AI-generated video?",
    answer: "To create your first AI-generated video, navigate to the 'Create' section, choose a template or start from scratch, input your desired content, and let our AI do the rest!"
  },
  {
    question: "What video formats are supported for export?",
    answer: "We support exporting videos in MP4, MOV, and AVI formats. You can choose the format that best suits your needs in the export settings."
  },
  {
    question: "How can I customize the AI-generated voice in my videos?",
    answer: "In the video creation process, you can select from a variety of AI voices or upload your own voiceover. You can also adjust the tone, speed, and emphasis of the AI voice."
  },
  {
    question: "Is there a limit to how many videos I can create?",
    answer: "The number of videos you can create depends on your subscription plan. Check your account details or our pricing page for specific limits on your plan."
  },
  {
    question: "Can I use my own images and music in the AI-generated videos?",
    answer: "Yes, you can upload and use your own images, music, and other assets in your AI-generated videos. Make sure you have the necessary rights to use these assets."
  },
  {
    question: "How do I share my created videos on social media?",
    answer: "After creating your video, you can use our built-in sharing features to post directly to various social media platforms or download the video to share manually."
  },
];

const FAQSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <VStack spacing={8} align="stretch">
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<Icon as={FiSearch} color="gray.300" />} />
        <Input
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg={bgColor}
          borderColor={borderColor}
        />
      </InputGroup>

      <Accordion allowMultiple>
        {filteredFAQs.map((faq, index) => (
          <AccordionItem key={index} border="1px" borderColor={borderColor} borderRadius="md" mb={4}>
            <h2>
              <AccordionButton _expanded={{ bg: 'purple.500', color: 'white' }}>
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={bgColor}>
              {faq.answer}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </VStack>
  );
};

const SupportSection = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack spacing={8} align="stretch">
      <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Heading size="md" mb={4}>Contact Support</Heading>
        <Text mb={4}>Our support team is available 24/7 to assist you with any questions or issues.</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Button leftIcon={<Icon as={FiMail} />} colorScheme="purple" variant="outline">
            Email Support
          </Button>
          <Button leftIcon={<Icon as={FiMessageSquare} />} colorScheme="purple">
            Live Chat
          </Button>
          <Button leftIcon={<Icon as={FiPhone} />} colorScheme="purple" variant="outline">
            Phone Support
          </Button>
          <Button leftIcon={<Icon as={FiFileText} />} colorScheme="purple" variant="outline">
            Submit a Ticket
          </Button>
        </SimpleGrid>
      </Box>

      <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Heading size="md" mb={4}>Submit a Support Request</Heading>
        <VStack spacing={4} as="form">
          <FormControl isRequired>
            <FormLabel>Subject</FormLabel>
            <Input placeholder="Brief description of your issue" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select placeholder="Select category">
              <option value="account">Account Issues</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical Support</option>
              <option value="feature">Feature Request</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea placeholder="Provide details about your issue or question" />
          </FormControl>
          <Button colorScheme="purple" alignSelf="flex-start">Submit Request</Button>
        </VStack>
      </Box>
    </VStack>
  );
};

const FAQAndSupport = () => {
  useEffect(() => {
    // Initialize Crisp chat if it's not already initialized
    if (window.$crisp) {
      // Add event listener for chat closed event
      window.$crisp.push(["on", "chat:closed", () => {
        // Hide the chat bubble when chat is closed
        window.$crisp.push(["do", "chat:hide"]);
      }]);
    }

    // Cleanup function
    return () => {
      if (window.$crisp) {
        // Remove the event listener when component unmounts
        window.$crisp.push(["off", "chat:closed"]);
      }
    };
  }, []);

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={4}>FAQ & Support</Heading>
          <Text fontSize="lg" color="gray.500">Find answers to common questions or get in touch with our support team.</Text>
        </Box>

        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab><Icon as={FiHelpCircle} mr={2} />FAQ</Tab>
            <Tab><Icon as={FiMessageSquare} mr={2} />Support</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <FAQSection />
            </TabPanel>
            <TabPanel>
              <SupportSection />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default FAQAndSupport;