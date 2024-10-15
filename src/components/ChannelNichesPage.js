import React, { useState } from 'react';
import {
  Box, VStack, Heading, Text, Button, SimpleGrid, Input, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, Tag, Wrap, useToast, Container, Flex, Icon, Image, Badge,
  Tabs, TabList, TabPanels, Tab, TabPanel, Progress, Tooltip, Avatar,
  InputGroup, InputLeftElement, useColorModeValue
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiTrendingUp, FiBookOpen, FiTarget, FiAward, FiUsers, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function ChannelNichesPage() {
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const niches = [
    { id: 1, name: 'Tech Reviews', description: 'Review the latest gadgets and tech products', popularity: 85, competition: 70, profitability: 80, image: 'https://example.com/tech.jpg' },
    { id: 2, name: 'Cooking Tutorials', description: 'Step-by-step cooking guides for various cuisines', popularity: 90, competition: 75, profitability: 70, image: 'https://example.com/cooking.jpg' },
    { id: 3, name: 'Fitness & Workouts', description: 'Exercise routines and fitness tips for all levels', popularity: 80, competition: 65, profitability: 75, image: 'https://example.com/fitness.jpg' }
  ];

  const handleNicheSelect = (niche) => {
    setSelectedNiche(niche);
    onOpen();
  };

  const confirmNicheSelection = () => {
    onClose();
    toast({
      title: 'Niche Selected',
      description: `You've selected the ${selectedNiche.name} niche.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredNiches = niches.filter(niche => 
    niche.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={8} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Flex direction="column" align="center" textAlign="center">
            <Heading as="h1" size="2xl" mb={4} color={textColor}>Discover Your Perfect Niche</Heading>
            <Text fontSize="xl" maxW="800px" color={textColor}>Explore trending niches, analyze market potential, and find your passion to create content that resonates with your audience.</Text>
          </Flex>
          
          <Flex justifyContent="center" alignItems="center" mb={8}>
            <InputGroup size="lg" maxW="600px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color={useColorModeValue('gray.400', 'gray.300')} />
              </InputLeftElement>
              <Input
                placeholder="Search niches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={cardBgColor}
                borderColor={borderColor}
                _hover={{ borderColor: useColorModeValue('gray.300', 'gray.600') }}
                _focus={{ borderColor: 'blue.500' }}
                color={textColor}
              />
            </InputGroup>
          </Flex>

          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList justifyContent="center" mb={8}>
              <Tab>All Niches</Tab>
              <Tab>Trending</Tab>
              <Tab>Recommended for You</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                  {filteredNiches.map(niche => (
                    <MotionBox
                      key={niche.id}
                      borderWidth={1}
                      borderRadius="lg"
                      overflow="hidden"
                      bg={cardBgColor}
                      boxShadow="md"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                      borderColor={borderColor}
                    >
                      <Image src={niche.image} alt={niche.name} height="200px" width="100%" objectFit="cover" />
                      <Box p={6}>
                        <Heading size="md" mb={2} color={textColor}>{niche.name}</Heading>
                        <Text mb={4} color={textColor}>{niche.description}</Text>
                        <Wrap spacing={2} mb={4}>
                          <Badge colorScheme="purple">Popularity: {niche.popularity}%</Badge>
                          <Badge colorScheme="orange">Competition: {niche.competition}%</Badge>
                          <Badge colorScheme="green">Profitability: {niche.profitability}%</Badge>
                        </Wrap>
                        <Button colorScheme="blue" width="full" onClick={() => handleNicheSelect(niche)}>
                          Explore Niche
                        </Button>
                      </Box>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                {/* Add content for Trending niches */}
              </TabPanel>
              <TabPanel>
                {/* Add content for Recommended niches */}
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Box bg={cardBgColor} borderRadius="lg" p={8} boxShadow="md" borderColor={borderColor} borderWidth={1}>
            <Heading size="lg" mb={6} color={textColor}>Niche Insights</Heading>
            <SimpleGrid columns={[1, 2, 3]} spacing={8}>
              <MotionBox whileHover={{ scale: 1.05 }}>
                <Icon as={FiTrendingUp} boxSize={10} mb={4} color="purple.500" />
                <Heading size="md" mb={2} color={textColor}>Trend Analysis</Heading>
                <Text color={textColor}>Stay ahead of the curve with our AI-powered trend predictions.</Text>
              </MotionBox>
              <MotionBox whileHover={{ scale: 1.05 }}>
                <Icon as={FiUsers} boxSize={10} mb={4} color="blue.500" />
                <Heading size="md" mb={2} color={textColor}>Audience Insights</Heading>
                <Text color={textColor}>Understand your potential audience demographics and preferences.</Text>
              </MotionBox>
              <MotionBox whileHover={{ scale: 1.05 }}>
                <Icon as={FiDollarSign} boxSize={10} mb={4} color="green.500" />
                <Heading size="md" mb={2} color={textColor}>Monetization Potential</Heading>
                <Text color={textColor}>Explore various monetization strategies for your chosen niche.</Text>
              </MotionBox>
            </SimpleGrid>
          </Box>

          <Flex justifyContent="center">
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              size="lg"
              onClick={() => {}}
              borderRadius="full"
              px={8}
            >
              Suggest a New Niche
            </Button>
          </Flex>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="lg" bg={cardBgColor}>
          <ModalHeader color={textColor}>Niche Details: {selectedNiche?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedNiche && (
              <VStack spacing={6} align="stretch">
                <Image src={selectedNiche.image} alt={selectedNiche.name} borderRadius="md" />
                <Text color={textColor}>{selectedNiche.description}</Text>
                <Box>
                  <Text fontWeight="bold" mb={2} color={textColor}>Popularity</Text>
                  <Progress value={selectedNiche.popularity} colorScheme="purple" borderRadius="full" />
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2} color={textColor}>Competition</Text>
                  <Progress value={selectedNiche.competition} colorScheme="orange" borderRadius="full" />
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2} color={textColor}>Profitability</Text>
                  <Progress value={selectedNiche.profitability} colorScheme="green" borderRadius="full" />
                </Box>
                <Box>
                  <Heading size="md" mb={4} color={textColor}>Top Creators in this Niche</Heading>
                  <Wrap>
                    {[1, 2, 3, 4, 5].map((creator) => (
                      <Tooltip key={creator} label={`Creator ${creator}`}>
                        <Avatar size="md" name={`Creator ${creator}`} src={`https://example.com/creator${creator}.jpg`} />
                      </Tooltip>
                    ))}
                  </Wrap>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={confirmNicheSelection}>
              Select This Niche
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ChannelNichesPage;