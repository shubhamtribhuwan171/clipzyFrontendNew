import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Button, SimpleGrid, Input, Textarea,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, Tag, Wrap, useToast, Menu, MenuButton, MenuList, MenuItem,
  Container, Flex, Icon, Progress, Avatar, AvatarGroup, Tooltip, Badge,
  Tabs, TabList, TabPanels, Tab, TabPanel, InputGroup, InputLeftElement,
  useColorModeValue
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiMoreVertical, FiBookOpen, FiZap, FiTrendingUp, FiSearch, FiVideo, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function ScriptsPage() {
  const [scripts, setScripts] = useState([]);
  const [currentScript, setCurrentScript] = useState({ title: '', content: '', tags: [] });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    // Fetch scripts from API or local storage
    // For demo purposes, we'll use dummy data
    setScripts([
      { id: 1, title: 'Top 10 Tech Gadgets', content: 'In this video, well explore...', tags: ['tech', 'gadgets'], progress: 70, collaborators: 2 },
      { id: 2, title: 'Easy Vegan Recipes', content: 'Today, were making delicious...', tags: ['cooking', 'vegan'], progress: 90, collaborators: 1 },
      { id: 3, title: 'Home Workout Routine', content: 'Get ready for an intense...', tags: ['fitness', 'workout'], progress: 40, collaborators: 3 }
    ]);
  }, []);

  const handleScriptCreate = () => {
    setCurrentScript({ title: '', content: '', tags: [] });
    onOpen();
  };

  const handleScriptEdit = (script) => {
    setCurrentScript(script);
    onOpen();
  };

  const handleScriptDelete = (scriptId) => {
    setScripts(scripts.filter(script => script.id !== scriptId));
    toast({
      title: 'Script Deleted',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleScriptSave = () => {
    if (currentScript.id) {
      setScripts(scripts.map(script => 
        script.id === currentScript.id ? currentScript : script
      ));
    } else {
      setScripts([...scripts, { ...currentScript, id: Date.now(), progress: 0, collaborators: 1 }]);
    }
    onClose();
    toast({
      title: currentScript.id ? 'Script Updated' : 'Script Created',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleScriptGenerate = (scriptId) => {
    toast({
      title: 'Generating Video',
      description: 'Your video is being generated from the script.',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={8} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <Flex direction="column" align="center" textAlign="center">
            <Heading as="h1" size="2xl" mb={4} color={textColor}>Create Captivating Scripts</Heading>
            <Text fontSize="xl" maxW="800px" color={textColor}>Craft engaging stories, collaborate with your team, and bring your content to life with our advanced scripting tools.</Text>
          </Flex>

          <Flex justifyContent="space-between" alignItems="center">
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color={textColor} />
              </InputLeftElement>
              <Input placeholder="Search scripts..." bg={cardBgColor} color={textColor} />
            </InputGroup>
            <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={handleScriptCreate} size="lg">
              Create New Script
            </Button>
          </Flex>

          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList>
              <Tab>All Scripts</Tab>
              <Tab>In Progress</Tab>
              <Tab>Completed</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                  {scripts.map(script => (
                    <MotionBox
                      key={script.id}
                      borderWidth={1}
                      borderRadius="lg"
                      p={6}
                      bg={cardBgColor}
                      borderColor={borderColor}
                      boxShadow="md"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Heading size="md" mb={2} color={textColor}>{script.title}</Heading>
                      <Text noOfLines={3} mb={4} color={textColor}>{script.content}</Text>
                      <Wrap mb={4}>
                        {script.tags.map(tag => (
                          <Badge key={tag} colorScheme="blue">{tag}</Badge>
                        ))}
                      </Wrap>
                      <Flex justifyContent="space-between" alignItems="center" mb={4}>
                        <Text fontSize="sm" color={textColor}>Progress:</Text>
                        <Progress value={script.progress} size="sm" width="70%" colorScheme="green" borderRadius="full" />
                      </Flex>
                      <Flex justifyContent="space-between" alignItems="center">
                        <AvatarGroup size="sm" max={3}>
                          {[...Array(script.collaborators)].map((_, i) => (
                            <Avatar key={i} name={`Collaborator ${i + 1}`} />
                          ))}
                        </AvatarGroup>
                        <Menu>
                          <MenuButton as={Button} size="sm" rightIcon={<FiMoreVertical />}>
                            Actions
                          </MenuButton>
                          <MenuList>
                            <MenuItem icon={<FiEdit />} onClick={() => handleScriptEdit(script)}>Edit</MenuItem>
                            <MenuItem icon={<FiVideo />} onClick={() => handleScriptGenerate(script.id)}>Generate Video</MenuItem>
                            <MenuItem icon={<FiTrash2 />} onClick={() => handleScriptDelete(script.id)}>Delete</MenuItem>
                          </MenuList>
                        </Menu>
                      </Flex>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                {/* Add content for In Progress scripts */}
              </TabPanel>
              <TabPanel>
                {/* Add content for Completed scripts */}
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Box bg={cardBgColor} borderRadius="lg" p={8} boxShadow="md" borderColor={borderColor} borderWidth={1}>
            <Heading size="lg" mb={6} color={textColor}>Scripting Tools</Heading>
            <SimpleGrid columns={[1, 2, 3]} spacing={8}>
              <MotionBox whileHover={{ scale: 1.05 }}>
                <Icon as={FiBookOpen} boxSize={10} mb={4} color="blue.500" />
                <Heading size="md" mb={2} color={textColor}>Script Templates</Heading>
                <Text color={textColor}>Access a variety of script templates to kickstart your content creation.</Text>
              </MotionBox>
              <MotionBox whileHover={{ scale: 1.05 }}>
                <Icon as={FiZap} boxSize={10} mb={4} color="yellow.500" />
                <Heading size="md" mb={2} color={textColor}>AI Script Generator</Heading>
                <Text color={textColor}>Let our AI help you generate unique and engaging script ideas.</Text>
              </MotionBox>
              <MotionBox whileHover={{ scale: 1.05 }}>
                <Icon as={FiTrendingUp} boxSize={10} mb={4} color="green.500" />
                <Heading size="md" mb={2} color={textColor}>Trending Topics</Heading>
                <Text color={textColor}>Explore current trends to create timely and relevant content.</Text>
              </MotionBox>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={cardBgColor}>
          <ModalHeader color={textColor}>{currentScript.id ? 'Edit Script' : 'Create New Script'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input 
                placeholder="Script Title" 
                value={currentScript.title}
                onChange={(e) => setCurrentScript({...currentScript, title: e.target.value})}
                bg={cardBgColor}
                color={textColor}
              />
              <Textarea 
                placeholder="Script Content" 
                value={currentScript.content}
                onChange={(e) => setCurrentScript({...currentScript, content: e.target.value})}
                minHeight="200px"
                bg={cardBgColor}
                color={textColor}
              />
              <Input 
                placeholder="Tags (comma-separated)" 
                value={currentScript.tags.join(', ')}
                onChange={(e) => setCurrentScript({...currentScript, tags: e.target.value.split(',').map(tag => tag.trim())})}
                bg={cardBgColor}
                color={textColor}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleScriptSave}>Save Script</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ScriptsPage;