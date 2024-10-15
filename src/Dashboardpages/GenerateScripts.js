import React, { useState, useEffect } from 'react';
import {
  Box, Flex, VStack, Heading, Input, Button, Select, Text, useToast,
  useColorModeValue, Card, CardBody, IconButton, useMediaQuery, Container,
  SimpleGrid, Textarea, Divider
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiSave } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import BottomTabBar from '../components/BottomTabBar';

const GenerateScripts = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [scripts, setScripts] = useState([]);
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [selectedScript, setSelectedScript] = useState(null);
  const toast = useToast();

  // Color scheme
  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('purple.500', 'purple.300');

  useEffect(() => {
    // Fetch existing scripts from API or local storage
    // For demo purposes, we'll use dummy data
    setScripts([
      { id: 1, title: 'Tech Gadgets Review', category: 'Technology', content: 'This is a sample script about tech gadgets. It covers the latest smartphones, laptops, and smart home devices.' },
      { id: 2, title: 'Healthy Recipes', category: 'Cooking', content: 'Here is a script about healthy cooking. It includes recipes for nutritious smoothies, salads, and lean protein dishes.' },
    ]);
  }, []);

  const handleGenerate = async () => {
    // Call API to generate script
    // For demo purposes, we'll use a dummy response
    const dummyResponse = `Generated script for ${category} ${keyword ? `about ${keyword}` : ''}. This is a placeholder for the actual generated content. It would typically include multiple paragraphs of relevant information based on the selected category and keyword.`;
    setGeneratedScript(dummyResponse);
    setSelectedScript(null);
  };

  const handleSave = () => {
    if (generatedScript) {
      const newScript = {
        id: Date.now(),
        title: `${category} ${keyword}`.trim(),
        category: category,
        content: generatedScript,
      };
      setScripts([newScript, ...scripts]);
      setGeneratedScript('');
      setCategory('');
      setKeyword('');
      toast({
        title: 'Script saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (id) => {
    setScripts(scripts.filter(script => script.id !== id));
    if (selectedScript && selectedScript.id === id) {
      setSelectedScript(null);
      setGeneratedScript('');
    }
    toast({
      title: 'Script deleted',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleScriptSelect = (script) => {
    setSelectedScript(script);
    setCategory(script.category);
    setKeyword(script.title.replace(script.category, '').trim());
    setGeneratedScript(script.content);
  };

  return (
    <Flex flexDirection="column" height="100vh">
      <Flex flex={1} overflow="hidden">
        {!isMobile && <Sidebar />}
        <Box flex={1} bg={bgColor} overflowY="auto">
          <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
              <Heading color={textColor}>Generate Scripts</Heading>
              
              <Flex direction={isMobile ? "column" : "row"} spacing={8}>
                <Box flex={1} mr={isMobile ? 0 : 4} mb={isMobile ? 4 : 0}>
                  <Card bg={cardBgColor} shadow="md">
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Select 
                          placeholder="Select category" 
                          value={category} 
                          onChange={(e) => setCategory(e.target.value)}
                          color={textColor}
                        >
                          <option value="Technology">Technology</option>
                          <option value="Cooking">Cooking</option>
                          <option value="Travel">Travel</option>
                        </Select>
                        <Input
                          placeholder="Enter keyword (optional)"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          color={textColor}
                        />
                        <Button leftIcon={<FiPlus />} onClick={handleGenerate} colorScheme="purple">
                          Generate Script
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
                <Box flex={1} ml={isMobile ? 0 : 4}>
                  <Card bg={cardBgColor} shadow="md">
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md" color={textColor}>Output</Heading>
                        <Textarea 
                          value={generatedScript} 
                          onChange={(e) => setGeneratedScript(e.target.value)}
                          minHeight="200px"
                          color={textColor}
                          placeholder="Generated script will appear here..."
                        />
                        <Button leftIcon={<FiSave />} onClick={handleSave} colorScheme="purple" isDisabled={!generatedScript}>
                          Save Script
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
              </Flex>
              
              <Divider />
              
              <Heading size="md" color={textColor}>Existing Scripts</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {scripts.map((script) => (
                  <Card key={script.id} bg={cardBgColor} shadow="md" cursor="pointer" onClick={() => handleScriptSelect(script)}>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Heading size="sm" color={textColor}>{script.title}</Heading>
                        <Text fontSize="sm" color={textColor}>Category: {script.category}</Text>
                        <Text fontSize="sm" color={textColor} noOfLines={3}>{script.content}</Text>
                        <Flex justify="space-between">
                          <IconButton
                            icon={<FiEdit />}
                            aria-label="Edit script"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScriptSelect(script);
                            }}
                            colorScheme="purple"
                            variant="ghost"
                          />
                          <IconButton
                            icon={<FiTrash2 />}
                            aria-label="Delete script"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(script.id);
                            }}
                            colorScheme="red"
                            variant="ghost"
                          />
                        </Flex>
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
    </Flex>
  );
};

export default GenerateScripts;