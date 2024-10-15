import React, { useState, useEffect } from 'react';
import {
  Box, Flex, VStack, Heading, Textarea, Button, Text, useToast,
  useColorModeValue, Card, CardBody, IconButton, useMediaQuery, Container,
  SimpleGrid, Divider, HStack, Tag, Tooltip, AlertDialog,
  AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, useDisclosure,
  Input, Select, Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import { FiPlus, FiPlay, FiPause, FiTrash2, FiSave, FiInfo } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import BottomTabBar from '../components/BottomTabBar';
import { voicesData } from '../data/voicesData';

const VoiceCard = ({ voice, onSelect, isSelected }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      borderColor={isSelected ? 'purple.500' : borderColor}
      bg={bgColor}
      p={3}
      cursor="pointer"
      onClick={() => onSelect(voice)}
      transition="all 0.2s"
      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
      height="100%"
    >
      <VStack align="start" spacing={1}>
        <Text fontWeight="bold" color={textColor}>{voice.name}</Text>
        <Text fontSize="sm" color={textColor}>{voice.accent} - {voice.gender}</Text>
        <Text fontSize="xs" color={textColor} noOfLines={2}>{voice.description}</Text>
      </VStack>
    </Box>
  );
};

const GenerateVoiceovers = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [voiceovers, setVoiceovers] = useState([]);
  const [script, setScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [generatedVoiceover, setGeneratedVoiceover] = useState('');
  const [playingVoice, setPlayingVoice] = useState(null);
  const [voiceoverToDelete, setVoiceoverToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  const [filterAccent, setFilterAccent] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoiceDetails, setSelectedVoiceDetails] = useState(null);

  // Color scheme
  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    // Fetch existing voiceovers from API or local storage
    // For demo purposes, we'll use dummy data
    setVoiceovers([
      { id: 1, title: 'Welcome Message', duration: '00:30', url: 'https://example.com/welcome.mp3' },
      { id: 2, title: 'Product Introduction', duration: '01:15', url: 'https://example.com/product.mp3' },
    ]);
  }, []);


  const handleGenerate = async () => {
    if (!selectedVoice) {
      toast({
        title: 'Please select a voice',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Call API to generate voiceover
    // For demo purposes, we'll use a dummy response
    const dummyResponse = 'https://example.com/generated_voiceover.mp3';
    setGeneratedVoiceover(dummyResponse);
  };


  const handleSave = () => {
    if (generatedVoiceover) {
      const newVoiceover = {
        id: Date.now(),
        title: `Voiceover ${voiceovers.length + 1}`,
        duration: '00:45', // Dummy duration
        url: generatedVoiceover,
      };
      setVoiceovers([newVoiceover, ...voiceovers]);
      setGeneratedVoiceover('');
      setScript('');
      setSelectedVoice(null);
      toast({
        title: 'Voiceover saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirmation = (id) => {
    setVoiceoverToDelete(id);
    onOpen();
  };

  const handleDelete = () => {
    setVoiceovers(voiceovers.filter(voiceover => voiceover.id !== voiceoverToDelete));
    onClose();
    toast({
      title: 'Voiceover deleted',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePlayVoice = (voiceId) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
      // Implement pause functionality
    } else {
      setPlayingVoice(voiceId);
      // Implement play functionality
    }
  };

  const calculateCredits = () => {
    // This is a dummy calculation. Replace with actual logic.
    return Math.ceil(script.length / 100);
  };

  const filteredVoices = voicesData.filter(voice => {
    return (
      voice.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterAccent === '' || voice.accent === filterAccent) &&
      (filterGender === '' || voice.gender === filterGender)
    );
  });

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
    setSelectedVoiceDetails(voice);
  };

  return (
    <Flex flexDirection="column" height="100vh">
      <Flex flex={1} overflow="hidden">
        {!isMobile && <Sidebar />}
        <Box flex={1} bg={bgColor} overflowY="auto">
          <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
              <Heading color={textColor}>Generate Voiceovers</Heading>
              
              <Flex direction={isMobile ? "column" : "row"} spacing={8}>
                <Box flex={1} mr={isMobile ? 0 : 4} mb={isMobile ? 4 : 0}>
                  <Card bg={cardBgColor} shadow="md">
                    <CardBody>
                      <Tabs>
                        <TabList>
                          <Tab>Script</Tab>
                          <Tab>Voice</Tab>
                        </TabList>
                        <TabPanels>
                          <TabPanel>
                            <VStack spacing={4} align="stretch">
                              <Textarea
                                placeholder="Enter your script here"
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                                minHeight="150px"
                                color={textColor}
                              />
                              <Text fontSize="sm" color={textColor}>
                                Generating this voiceover will use approximately {calculateCredits()} credits.
                              </Text>
                            </VStack>
                          </TabPanel>
                          <TabPanel>
                            <VStack spacing={4} align="stretch">
                              <HStack>
                                <Input
                                  placeholder="Search voices"
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Select value={filterAccent} onChange={(e) => setFilterAccent(e.target.value)}>
                                  <option value="">All Accents</option>
                                  <option value="American">American</option>
                                  <option value="British">British</option>
                                  <option value="Australian">Australian</option>
                                </Select>
                                <Select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                                  <option value="">All Genders</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </Select>
                              </HStack>
                              <Box maxHeight="300px" overflowY="auto">
                                <SimpleGrid columns={3} spacing={3}>
                                  {filteredVoices.map((voice) => (
                                    <VoiceCard
                                      key={voice.voice_id}
                                      voice={voice}
                                      onSelect={handleVoiceSelect}
                                      isSelected={selectedVoice && selectedVoice.voice_id === voice.voice_id}
                                    />
                                  ))}
                                </SimpleGrid>
                              </Box>
                              {selectedVoiceDetails && (
                                <Box mt={4} p={4} borderWidth={1} borderRadius="md">
                                  <VStack align="start" spacing={2}>
                                    <Heading size="sm">{selectedVoiceDetails.name}</Heading>
                                    <Text>{selectedVoiceDetails.description}</Text>
                                    <HStack>
                                      <Tag size="sm">{selectedVoiceDetails.accent}</Tag>
                                      <Tag size="sm">{selectedVoiceDetails.gender}</Tag>
                                      <Tag size="sm">{selectedVoiceDetails.age}</Tag>
                                      <Tag size="sm">{selectedVoiceDetails.use_case}</Tag>
                                    </HStack>
                                    <Button
                                      size="sm"
                                      leftIcon={playingVoice === selectedVoiceDetails.voice_id ? <FiPause /> : <FiPlay />}
                                      onClick={() => handlePlayVoice(selectedVoiceDetails.voice_id)}
                                      colorScheme="purple"
                                      variant="outline"
                                    >
                                      {playingVoice === selectedVoiceDetails.voice_id ? 'Pause' : 'Preview'}
                                    </Button>
                                  </VStack>
                                </Box>
                              )}
                            </VStack>
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                      <Button 
                        leftIcon={<FiPlus />} 
                        onClick={handleGenerate} 
                        colorScheme="purple" 
                        isDisabled={!selectedVoice || !script}
                        mt={4}
                        width="100%"
                      >
                        Generate Voiceover
                      </Button>
                    </CardBody>
                  </Card>
                </Box>
                
                <Box flex={1} ml={isMobile ? 0 : 4}>
                  <Card bg={cardBgColor} shadow="md">
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md" color={textColor}>Output</Heading>
                        {generatedVoiceover ? (
                          <>
                            <audio controls src={generatedVoiceover} style={{width: '100%'}} />
                            <Button leftIcon={<FiSave />} onClick={handleSave} colorScheme="purple">
                              Save Voiceover
                            </Button>
                          </>
                        ) : (
                          <Text color={textColor}>Generated voiceover will appear here...</Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
              </Flex>
              
              <Divider />
              
              <Heading size="md" color={textColor}>Existing Voiceovers</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {voiceovers.map((voiceover) => (
                  <Card key={voiceover.id} bg={cardBgColor} shadow="md">
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="center">
                          <Heading size="sm" color={textColor}>{voiceover.title}</Heading>
                          <IconButton
                            icon={<FiTrash2 />}
                            aria-label="Delete voiceover"
                            onClick={() => handleDeleteConfirmation(voiceover.id)}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                          />
                        </Flex>
                        <Text fontSize="sm" color={textColor}>Duration: {voiceover.duration}</Text>
                        <audio controls src={voiceover.url} style={{width: '100%'}} />
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </Flex>
      {isMobile && <BottomTabBar />}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Voiceover
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default GenerateVoiceovers;