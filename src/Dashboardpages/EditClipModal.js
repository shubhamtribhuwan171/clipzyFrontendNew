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
} from '@chakra-ui/react';

import { EditIcon } from '@chakra-ui/icons';

export function EditClipModal({ isOpen, onClose, selectedClip, onUpdateClip }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleGenerateAI = () => {
    // Placeholder for AI generation logic
    console.log('Generating image with AI');
  };

  const handleUploadImage = (event) => {
    // Placeholder for image upload logic
    console.log('Uploading image:', event.target.files[0]);
  };

  const handleDeleteImage = () => {
    // Placeholder for delete image logic
    console.log('Deleting image');
    onUpdateClip(null);
    onClose();
  };

  const handleFindStock = () => {
    // Placeholder for find stock image logic
    console.log('Finding stock image');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Clip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Preview</Tab>
              <Tab>Generate AI</Tab>
              <Tab>Upload</Tab>
              <Tab>Delete</Tab>
              <Tab>Find Stock</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {selectedClip && (
                  <Image
                    src={selectedClip.src}
                    alt="Selected clip preview"
                    maxWidth="100%"
                    maxHeight="400px"
                    objectFit="contain"
                  />
                )}
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Text>Generate a new image using AI</Text>
                  <Input placeholder="Enter a description for the AI" />
                  <Button onClick={handleGenerateAI}>Generate</Button>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Text>Upload a new image</Text>
                  <Input type="file" onChange={handleUploadImage} accept="image/*" />
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Text>Are you sure you want to delete this image?</Text>
                  <Button colorScheme="red" onClick={handleDeleteImage}>Delete</Button>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Text>Search for a stock image</Text>
                  <Input placeholder="Enter keywords to search" />
                  <Button onClick={handleFindStock}>Search</Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};