import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, VStack, Heading, Input, Button, Image, SimpleGrid, useToast, Text,
  useColorModeValue, Card, CardBody, IconButton, useMediaQuery, Container,
  Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, useDisclosure, Tooltip
} from '@chakra-ui/react';
import { FiPlus, FiDownload, FiTrash2, FiInfo } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import BottomTabBar from '../components/BottomTabBar';

const GenerateImages = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [images, setImages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const toast = useToast();

  // State for Image Preview Modal
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef();

  // Color scheme
  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('purple.500', 'purple.300');

  useEffect(() => {
    // Fetch existing images from API or local storage
    // For demo purposes, we'll use dummy data
    setImages([
      { id: 1, url: './image1.jpg', prompt: 'A futuristic city', date: '2023-10-01' },
      { id: 2, url: './image2.jpg', prompt: 'A serene beach', date: '2023-10-05' },
    ]);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Please enter an image description.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Call API to generate image
    // For demo purposes, we'll use a placeholder image
    const dummyResponse = './image4.jpg';
    setGeneratedImage(dummyResponse);
    toast({
      title: 'Image generated successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSave = () => {
    if (generatedImage) {
      const newImage = {
        id: Date.now(),
        url: generatedImage,
        prompt: prompt,
        date: new Date().toISOString().split('T')[0], // Current date
      };
      setImages([newImage, ...images]);
      setGeneratedImage('');
      setPrompt('');
      toast({
        title: 'Image saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (id) => {
    setImages(images.filter(image => image.id !== id));
    toast({
      title: 'Image deleted',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    onOpen();
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    onClose();
  };

  return (
    <Flex flexDirection="column" height="100vh">
      <Flex flex={1} overflow="hidden">
        {!isMobile && <Sidebar />}
        <Box flex={1} bg={bgColor} overflowY="auto">
          <Container maxW="container.xl" py={8}>
            <VStack spacing={8} align="stretch">
              {/* Page Heading */}
              <Heading color={textColor}>Generate Images</Heading>

              {/* Generate and Output Section */}
              <Flex direction={isMobile ? "column" : "row"} spacing={8}>
                {/* Generate Image Section */}
                <Box flex={1} mr={isMobile ? 0 : 4} mb={isMobile ? 4 : 0}>
                  <Card bg={cardBgColor} shadow="md" borderRadius="lg">
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Input
                          placeholder="Enter image description"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          color={textColor}
                          bg={useColorModeValue('white', 'gray.600')}
                          _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }}
                        />
                        <Button
                          leftIcon={<FiPlus />}
                          onClick={handleGenerate}
                          colorScheme="purple"
                          isDisabled={!prompt.trim()}
                        >
                          Generate Image
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>

                {/* Output Section */}
                <Box flex={1} ml={isMobile ? 0 : 4}>
                  <Card bg={cardBgColor} shadow="md" borderRadius="lg">
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md" color={textColor}>Output</Heading>
                        {generatedImage ? (
                          <>
                            <Image
                              src={generatedImage}
                              alt="Generated image"
                              borderRadius="md"
                              maxH="300px"
                              objectFit="cover"
                              cursor="pointer"
                              onClick={() => openImageModal({
                                url: generatedImage,
                                prompt: prompt,
                                date: new Date().toISOString().split('T')[0],
                              })}
                              _hover={{ opacity: 0.8 }}
                            />
                            <Button
                              leftIcon={<FiDownload />}
                              onClick={() => window.open(generatedImage, '_blank')}
                              colorScheme="purple"
                              variant="outline"
                            >
                              Download Image
                            </Button>
                            <Button
                              leftIcon={<FiPlus />}
                              onClick={handleSave}
                              colorScheme="purple"
                            >
                              Save Image
                            </Button>
                          </>
                        ) : (
                          <Text color={textColor}>Generated image will appear here...</Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
              </Flex>

              <Divider />

              {/* Existing Images Section */}
              <Heading size="md" color={textColor}>Existing Images</Heading>
              {images.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {images.map((image) => (
                    <Card key={image.id} bg={cardBgColor} shadow="md" overflow="hidden">
                      <Image
                        src={image.url}
                        alt={image.prompt}
                        objectFit="cover"
                        height="200px"
                        width="100%"
                        cursor="pointer"
                        onClick={() => openImageModal(image)}
                        _hover={{ opacity: 0.8 }}
                      />
                      <CardBody>
                        <VStack align="stretch" spacing={2}>
                          <Text fontSize="sm" color={textColor} fontWeight="bold">{image.prompt}</Text>
                          <Text fontSize="xs" color={textColor}>Generated on: {image.date}</Text>
                          <Flex justify="space-between" align="center">
                            <Tooltip label="Download Image" aria-label="Download Image">
                              <IconButton
                                icon={<FiDownload />}
                                aria-label="Download image"
                                onClick={() => window.open(image.url, '_blank')}
                                colorScheme="purple"
                                variant="ghost"
                                size="sm"
                              />
                            </Tooltip>
                            <Tooltip label="Delete Image" aria-label="Delete Image">
                              <IconButton
                                icon={<FiTrash2 />}
                                aria-label="Delete image"
                                onClick={() => handleDelete(image.id)}
                                colorScheme="red"
                                variant="ghost"
                                size="sm"
                              />
                            </Tooltip>
                          </Flex>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              ) : (
                <Flex justify="center" align="center" height="200px">
                  <Text fontSize="lg" color={textColor}>No images found. Start generating!</Text>
                </Flex>
              )}
            </VStack>
          </Container>
        </Box>
      </Flex>
      {isMobile && <BottomTabBar />}

      {/* Image Preview Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeImageModal}
        initialFocusRef={initialRef}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg={cardBgColor} color={textColor}>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedImage && (
              <VStack spacing={4}>
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  borderRadius="md"
                  maxH="500px"
                  objectFit="contain"
                />
                <Box width="100%">
                  <Text fontSize="md" fontWeight="bold">Description:</Text>
                  <Text fontSize="sm" mb={2}>{selectedImage.prompt}</Text>
                  <Text fontSize="md" fontWeight="bold">Generated On:</Text>
                  <Text fontSize="sm">{selectedImage.date}</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            {selectedImage && (
              <>
                <Button
                  leftIcon={<FiDownload />}
                  onClick={() => window.open(selectedImage.url, '_blank')}
                  colorScheme="purple"
                  mr={3}
                >
                  Download
                </Button>
                <Button
                  leftIcon={<FiTrash2 />}
                  onClick={() => {
                    handleDelete(selectedImage.id);
                    closeImageModal();
                  }}
                  colorScheme="red"
                  variant="outline"
                >
                  Delete
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default GenerateImages;
