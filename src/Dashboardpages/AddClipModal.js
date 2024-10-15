import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  useToast,
} from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';

export function AddClipModal({ isOpen, onClose, onAddClip }) {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [stockKeyword, setStockKeyword] = useState('');
  const toast = useToast();

  const handleSubmit = () => {
    let newClipData = {};
    switch (activeTab) {
      case 0: // Upload
        if (!uploadedImage) {
          toast({
            title: "No image uploaded",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        newClipData = { src: URL.createObjectURL(uploadedImage) };
        break;
      case 1: // URL
        if (!imageUrl) {
          toast({
            title: "No URL provided",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        newClipData = { src: imageUrl };
        break;
      case 2: // Generate AI
        // In a real application, you would call an AI image generation API here
        toast({
          title: "AI image generation",
          description: "This feature is not implemented in this demo.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      case 3: // Find Stock
        // In a real application, you would call a stock image API here
        toast({
          title: "Stock image search",
          description: "This feature is not implemented in this demo.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      default:
        return;
    }
    onAddClip(newClipData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setUploadedImage(null);
    setImageUrl('');
    setAiPrompt('');
    setStockKeyword('');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Clip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Upload</Tab>
              <Tab>URL</Tab>
              <Tab>Generate AI</Tab>
              <Tab>Find Stock</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  {uploadedImage && (
                    <Box mt={4}>
                      <Text mb={2}>Preview:</Text>
                      <Image
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Uploaded preview"
                        maxHeight="200px"
                        objectFit="contain"
                      />
                    </Box>
                  )}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Input
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <Box mt={4}>
                      <Text mb={2}>Preview:</Text>
                      <Image
                        src={imageUrl}
                        alt="URL preview"
                        maxHeight="200px"
                        objectFit="contain"
                      />
                    </Box>
                  )}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Input
                    placeholder="Enter prompt for AI image generation"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <Text fontSize="sm" color="gray.500">
                    Note: AI image generation is not implemented in this demo.
                  </Text>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Input
                    placeholder="Enter keywords to search stock images"
                    value={stockKeyword}
                    onChange={(e) => setStockKeyword(e.target.value)}
                  />
                  <Text fontSize="sm" color="gray.500">
                    Note: Stock image search is not implemented in this demo.
                  </Text>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Button mt={4} onClick={handleSubmit} colorScheme="blue">
            Add Clip
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};