// import React, { useState, useEffect } from 'react';
// import { Box, Textarea, Select, Button, Text, VStack, HStack, useColorModeValue, Progress, Tooltip } from '@chakra-ui/react';
// import { RepeatIcon, ViewIcon } from '@chakra-ui/icons';

// const voices = [
//   { name: 'Adam', description: 'middle aged male, deep, narration' },
//   { name: 'Eve', description: 'young female, bright, conversational' },
//   { name: 'Sam', description: 'gender neutral, calm, informative' },
//   { name: 'Zoe', description: 'elderly female, warm, storytelling' },
//   { name: 'Max', description: 'young male, energetic, upbeat' },
// ];

// const VoicePanel = () => {
//   const [script, setScript] = useState('');
//   const [selectedVoice, setSelectedVoice] = useState(voices[0].name);
//   const [charCount, setCharCount] = useState(0);
//   const [isRegenerating, setIsRegenerating] = useState(false);

//   useEffect(() => {
//     const initialScript = "Welcome to our voice panel. Here you can edit your script and choose a voice for your project.";
//     setScript(initialScript);
//     setCharCount(initialScript.length);
//   }, []);

//   const handleScriptChange = (e) => {
//     setScript(e.target.value);
//     setCharCount(e.target.value.length);
//   };

//   const handleVoiceChange = (e) => {
//     setSelectedVoice(e.target.value);
//   };

//   const handleRegenerate = () => {
//     setIsRegenerating(true);
//     // Simulating regeneration process
//     setTimeout(() => {
//       setIsRegenerating(false);
//     }, 2000);
//   };

//   const bgColor = useColorModeValue("gray.50", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.600");

//   return (
//     <Box bg={bgColor} p={4} height="100%" borderRadius="md" boxShadow="md">
//       <VStack spacing={4} align="stretch">
//         <Text fontSize="xl" fontWeight="bold">Voice Script Editor</Text>
//         <Box borderWidth={1} borderColor={borderColor} p={4} borderRadius="md">
//           <VStack spacing={3} align="stretch">
//             <Textarea
//               value={script}
//               onChange={handleScriptChange}
//               placeholder="Enter your script here..."
//               size="sm"
//               resize="vertical"
//               minHeight="150px"
//             />
//             <HStack justifyContent="space-between">
//               <Text fontSize="sm" color={charCount > 1350 ? "red.500" : "gray.500"}>
//                 Characters: {charCount} / 1350
//               </Text>
//               <Progress value={(charCount / 1350) * 100} size="sm" width="50%" colorScheme={charCount > 1350 ? "red" : "green"} />
//             </HStack>
//           </VStack>
//         </Box>
//         <Box borderWidth={1} borderColor={borderColor} p={4} borderRadius="md">
//           <VStack spacing={3} align="stretch">
//             <Text fontSize="lg" fontWeight="semibold">Voice Selection</Text>
//             <Select value={selectedVoice} onChange={handleVoiceChange} size="sm">
//               {voices.map((voice) => (
//                 <option key={voice.name} value={voice.name}>
//                   {voice.name} - {voice.description}
//                 </option>
//               ))}
//             </Select>
//             <HStack spacing={2} justifyContent="space-between">
//               <Button
//                 leftIcon={<RepeatIcon />}
//                 onClick={handleRegenerate}
//                 colorScheme="blue"
//                 isLoading={isRegenerating}
//                 loadingText="Regenerating..."
//               >
//                 Regenerate Voice Script
//               </Button>
//               <Tooltip label="Preview voice">
//                 <Button leftIcon={<ViewIcon />} variant="outline">
//                   Preview
//                 </Button>
//               </Tooltip>
//             </HStack>
//           </VStack>
//         </Box>
//       </VStack>
//     </Box>
//   );
// };

// export default VoicePanel;

import React, { useState, useEffect } from 'react';
import {
  Box, Textarea, Button, Text, VStack, HStack, Progress, Tooltip, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { RepeatIcon, ViewIcon } from '@chakra-ui/icons';
import VoiceStep from '../../components/Videocreation/steps/VoiceStep'; // Import VoiceStep

const VoicePanel = () => {
  const [script, setScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(null); // Update selectedVoice to handle object structure
  const [charCount, setCharCount] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI's hook for modal control

  useEffect(() => {
    const initialScript = "Welcome to our voice panel. Here you can edit your script and choose a voice for your project.";
    setScript(initialScript);
    setCharCount(initialScript.length);
  }, []);

  const handleScriptChange = (e) => {
    setScript(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 2000);
  };

  return (
    <>
      <Button style={{top:'40%', left:'30%'}} onClick={onOpen} colorScheme="blue">
        Open Voice Panel
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Voice Script Editor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box borderWidth={1} p={4} borderRadius="md">
                <VStack spacing={3} align="stretch">
                  <Textarea
                    value={script}
                    onChange={handleScriptChange}
                    placeholder="Enter your script here..."
                    size="sm"
                    resize="vertical"
                    minHeight="100px"
                    maxHeight="150px"
                  />
                  <HStack justifyContent="space-between">
                    <Text fontSize="sm" color={charCount > 1350 ? "red.500" : "gray.500"}>
                      Characters: {charCount} / 1350
                    </Text>
                    <Progress value={(charCount / 1350) * 100} size="sm" width="50%" colorScheme={charCount > 1350 ? "red" : "green"} />
                  </HStack>
                </VStack>
              </Box>

              <VoiceStep selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} />

              <HStack spacing={2} justifyContent="space-between">
                <Button
                  leftIcon={<RepeatIcon />}
                  onClick={handleRegenerate}
                  colorScheme="blue"
                  isLoading={isRegenerating}
                  loadingText="Regenerating..."
                >
                  Regenerate Voice Script
                </Button>
                <Tooltip label="Preview voice">
                  <Button leftIcon={<ViewIcon />} variant="outline">
                    Preview
                  </Button>
                </Tooltip>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VoicePanel;
