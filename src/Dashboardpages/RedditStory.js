// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Progress, Modal,
//   ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure
// } from '@chakra-ui/react';
// import {
//   Box, Flex, VStack, HStack, Text, Heading, Input, Button, Textarea, Switch,
//   useColorMode, IconButton, Card, CardBody, Select, AspectRatio, Tooltip,
//   Image, FormControl, FormLabel, Editable, EditableInput, EditablePreview
// } from '@chakra-ui/react';
// import { FiSun, FiMoon, FiUpload, FiPlay, FiPause, FiMusic, FiVideo, FiMic, FiUser, FiMessageSquare, FiShare2, FiEdit, FiSettings, FiHelpCircle, FiArrowLeft } from 'react-icons/fi';
// import { Composition } from 'remotion';
// import { useNavigate } from 'react-router-dom';
// import { RepeatIcon, ViewIcon } from '@chakra-ui/icons';
// import Sidebar from '../components/Sidebar';
// import VoiceStep from '../components/Videocreation/steps/VoiceStep'; // Import VoiceStep
// import outputVideo from '../../src/output.mp4';

// const voiceOptions = ["Male 1", "Male 2", "Female 1", "Female 2", "Neutral"];

// // const RedditVideo = ({ title, profileName, script, profileImage, backgroundVideo }) => (
// //   <div style={{ padding: 20, color: '#000', backgroundColor: '#fff', border: '1px solid #ddd' }}>
// //     <h1>{title || "Reddit Post Title"}</h1>
// //     <h3>{profileName || "username"}</h3>
// //     {profileImage && <img src={profileImage} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%' }} />}
// //     <p>{script || "Your script will appear here..."}</p>
// //     {backgroundVideo && <video src={backgroundVideo} style={{ width: '100%', height: 'auto' }} />}
// //   </div>
// // );

// const RedditVideo = ({ title, profileName, script, profileImage, backgroundVideo }) => (
//   <div style={{ padding: 20, color: '#000', backgroundColor: '#fff', border: '1px solid #ddd' }}>
//     <h1>{title || "Reddit Post Title"}</h1>
//     <h3>{profileName || "username"}</h3>
//     {profileImage && <img src={profileImage} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%' }} />}
//     <p>{script || "Your script will appear here..."}</p>
//     {backgroundVideo && <video src={backgroundVideo} style={{ width: '100%', height: 'auto' }} controls />}
//   </div>
// );

// function RedditStory() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   const [title, setTitle] = useState("");
//   const [profileName, setProfileName] = useState("");
//   const [introVoice, setIntroVoice] = useState(voiceOptions[0]);
//   const [storyVoice, setStoryVoice] = useState(voiceOptions[0]);
//   const [previewPlaying, setPreviewPlaying] = useState(false);
//   const [profileImage, setProfileImage] = useState(null);
//   const [backgroundVideo, setBackgroundVideo] = useState(null);
//   const [projectTitle, setProjectTitle] = useState("My Reddit Video Project");

//   const profileImageInputRef = useRef(null);
//   const backgroundVideoInputRef = useRef(null);
//   const navigate = useNavigate();

//   const [selectedSidebarItem, setSelectedSidebarItem] = useState('Music');

//   const handleSidebarItemClick = (item) => {
//     setSelectedSidebarItem(item === selectedSidebarItem ? null : item);
//   };


//   const buttonStyles = {
//     backgroundColor: '#6200ea',
//     color: '#fff',
//     padding: '10px 20px',
//     borderRadius: '30px',
//     fontWeight: 'bold',
//     textTransform: 'none',
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',

//   };

//   const hoverStyles = {
//     backgroundColor: '#4500c0',
//   };

//   const iconStyles = {
//     marginLeft: '8px',
//   };

//   const handleProfileImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleBackgroundVideoUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setBackgroundVideo(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const [script, setScript] = useState('');
//   const [selectedVoice, setSelectedVoice] = useState(null); // Update selectedVoice to handle object structure
//   const [charCount, setCharCount] = useState(0);
//   const [isRegenerating, setIsRegenerating] = useState(false);

//   const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI's hook for modal control

//   useEffect(() => {
//     const initialScript = "Welcome to our voice panel. Here you can edit your script and choose a voice for your project.";
//     setScript(initialScript);
//     setCharCount(initialScript.length);
//   }, []);

//   const handleScriptChange = (e) => {
//     setScript(e.target.value);
//     setCharCount(e.target.value.length);
//   };

//   const handleRegenerate = () => {
//     setIsRegenerating(true);
//     setTimeout(() => {
//       setIsRegenerating(false);
//     }, 2000);
//   };

//   return (
//     <Flex direction="column" h="120vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
//       {/* Top Bar */}

//       <Flex bg={colorMode === 'light' ? 'white' : 'gray.800'} p={4} alignItems="center" boxShadow="md">
//         <IconButton
//           icon={<FiArrowLeft />}
//           onClick={() => navigate('/home')}
//           aria-label="Back to Home"
//           mr={4}
//         />
//         <Editable
//           value={projectTitle}
//           onChange={(value) => setProjectTitle(value)}
//           fontSize="xl"
//           fontWeight="bold"
//           flex={1}
//         >
//           <EditablePreview />
//           <EditableInput />
//         </Editable>
//         <HStack spacing={2}>
//           <Tooltip label={colorMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
//             <Switch
//               isChecked={colorMode === 'dark'}
//               onChange={toggleColorMode}
//               size="sm"
//               colorScheme="purple"
//             />
//           </Tooltip>
//           <Tooltip label="Settings">
//             <IconButton icon={<FiSettings />} variant="ghost" aria-label="Settings" size="sm" />
//           </Tooltip>
//           <Tooltip label="Help">
//             <IconButton icon={<FiHelpCircle />} variant="ghost" aria-label="Help" size="sm" />
//           </Tooltip>
//         </HStack>
//       </Flex>

//       {/* Main Content */}
//       <Flex flex={1} overflow="hidden">
//         {/* Left Column - Inputs */}
//         <Box w="50%" p={4} overflowY="auto" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
//           <VStack spacing={4} align="stretch">
//             {/* Post Details Section */}
//             <Card>
//               <CardBody>
//                 <HStack mb={2}>
//                   <FiEdit color="blue.500" />
//                   <Heading size="sm">Post Details</Heading>
//                 </HStack>
//                 <VStack spacing={3}>
//                   <Box w="full">
//                     <Text fontSize="xs" mb={1}>Title</Text>
//                     <Input
//                       size="sm"
//                       value={title}
//                       onChange={(e) => setTitle(e.target.value)}
//                       placeholder="Enter post title"
//                       borderColor="blue.200"
//                     />
//                   </Box>
//                   <Box w="full">
//                     <Text fontSize="xs" mb={1}>Profile Name</Text>
//                     <Input
//                       size="sm"
//                       value={profileName}
//                       onChange={(e) => setProfileName(e.target.value)}
//                       placeholder="Enter profile name"
//                       borderColor="blue.200"
//                     />
//                   </Box>
//                   <FormControl>
//                     <FormLabel fontSize="xs">Profile Image</FormLabel>
//                     <Input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleProfileImageUpload}
//                       ref={profileImageInputRef}
//                       display="none"
//                     />
//                     <Button
//                       size="sm"
//                       leftIcon={<FiUpload />}
//                       onClick={() => profileImageInputRef.current.click()}
//                     >
//                       Upload Profile Image
//                     </Button>
//                   </FormControl>
//                   {profileImage && (
//                     <Image src={profileImage} alt="Profile" boxSize="50px" borderRadius="full" />
//                   )}
//                 </VStack>
//               </CardBody>
//             </Card>

//             {/* Script Section */}
//             <Card>
//               <CardBody>
//                 <HStack mb={2}>
//                   <FiEdit color="green.500" />
//                   <Heading size="sm">Script</Heading>
//                 </HStack>
//                 <Textarea
//                   size="sm"
//                   value={script}
//                   onChange={(e) => setScript(e.target.value)}
//                   placeholder="Enter your script here"
//                   rows={6}
//                   borderColor="green.200"
//                 />
//               </CardBody>
//             </Card>

//             {/* Voice Settings */}
//             <Card>
//               <CardBody>
//                 <HStack mb={2}>
//                   <FiMic color="purple.500" />
//                   <Heading size="sm">Voice Settings</Heading>
//                 </HStack>
//                 <VStack spacing={3}>
//                   <Box w="full">
//                     <Text fontSize="xs" mb={1}>Intro Voice</Text>
//                     <Select size="sm" value={introVoice} onChange={(e) => setIntroVoice(e.target.value)} borderColor="purple.200">
//                       {voiceOptions.map((voice) => (
//                         <option key={voice} value={voice}>{voice}</option>
//                       ))}
//                     </Select>
//                   </Box>
//                   <Box w="full">
//                     <Text fontSize="xs" mb={1}>Story Voice</Text>
//                     <Select size="sm" value={storyVoice} onChange={(e) => setStoryVoice(e.target.value)} borderColor="purple.200">
//                       {voiceOptions.map((voice) => (
//                         <option key={voice} value={voice}>{voice}</option>
//                       ))}
//                     </Select>
//                   </Box>
//                 </VStack>
//               </CardBody>
//             </Card>

//             {/* Background Video Upload */}
//             <Card>
//               <CardBody>
//                 <HStack mb={2}>
//                   <FiVideo color="orange.500" />
//                   <Heading size="sm">Background Video</Heading>
//                 </HStack>
//                 <FormControl>
//                   <Input
//                     type="file"
//                     accept="video/*"
//                     onChange={handleBackgroundVideoUpload}
//                     ref={backgroundVideoInputRef}
//                     display="none"
//                   />
//                   <Button
//                     size="sm"
//                     leftIcon={<FiUpload />}
//                     onClick={() => backgroundVideoInputRef.current.click()}
//                   >
//                     Upload Background Video
//                   </Button>
//                 </FormControl>
//                 {backgroundVideo && (
//                   <Text fontSize="xs" mt={2}>Video uploaded successfully</Text>
//                 )}
//               </CardBody>
//             </Card>
//             <Card>
//               <CardBody>
//                 <FormLabel fontSize="xs">Select Audio</FormLabel>

//                 <Button
//                   size="sm"
//                   leftIcon={<FiUpload />}
//                   onClick={onOpen}
//                 //onClick={() => audioFileInputRef.current.click()}
//                 >
//                   Select Audio File
//                 </Button>
//               </CardBody>
//             </Card>
//           </VStack>
//         </Box>

//         {/* Right Column - Video Preview with Remotion */}
//         <Flex w="50%" bg="gray.900" p={4} direction="column">
//           <Flex flex={1} align="center" justify="center">
//             <AspectRatio ratio={9 / 16} w="full" maxW="sm">
//               <Box bg={colorMode === 'light' ? 'white' : 'gray.800'} borderRadius="lg" overflow="hidden">
//                 <VStack h="full" spacing={0} p={4}>
//                   {/* Remotion Composition */}
//                   {/* <Composition
//                     id="RedditVideo"
//                     component={RedditVideo}
//                     durationInFrames={150}
//                     fps={30}
//                     width={1080}
//                     height={1920}
//                     defaultProps={{
//                       title,
//                       profileName,
//                       script,
//                       profileImage,
//                       backgroundVideo: VideoSamp
//                     }}
//                   /> */}
//                   <Composition
//   id="RedditVideo"
//   component={RedditVideo}
//   durationInFrames={150}
//   fps={30}
//   width={1080}
//   height={1920}
//   defaultProps={{
//     title,
//     profileName,
//     script,
//     profileImage,
//     backgroundVideo
//   }}
// />

//                 </VStack>
//               </Box>
//             </AspectRatio>
//           </Flex>
//           <Button
//             style={buttonStyles}
//             onMouseOver={(e) => (e.target.style.backgroundColor = hoverStyles.backgroundColor)}
//             onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyles.backgroundColor)}
//           //onClick={onClick}
//           //disabled={isLoading}
//           >

//             <>
//               Generate Video

//             </>

//           </Button>
//           {/* Play/Pause Button */}
//           <HStack justify="center" mt={4}>
//             <IconButton
//               icon={previewPlaying ? <FiPause /> : <FiPlay />}
//               onClick={() => setPreviewPlaying(!previewPlaying)}
//               aria-label={previewPlaying ? "Pause" : "Play"}
//               size="sm"
//               colorScheme="teal"
//             />
//           </HStack>

//         </Flex>
//       </Flex>
//       <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Voice Script Editor</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <VStack spacing={4} align="stretch">
//               <Box borderWidth={1} p={4} borderRadius="md">
//                 <VStack spacing={3} align="stretch">
//                   <Textarea
//                     value={script}
//                     onChange={handleScriptChange}
//                     placeholder="Enter your script here..."
//                     size="sm"
//                     resize="vertical"
//                     minHeight="100px"
//                     maxHeight="150px"
//                   />
//                   <HStack justifyContent="space-between">
//                     <Text fontSize="sm" color={charCount > 1350 ? "red.500" : "gray.500"}>
//                       Characters: {charCount} / 1350
//                     </Text>
//                     <Progress value={(charCount / 1350) * 100} size="sm" width="50%" colorScheme={charCount > 1350 ? "red" : "green"} />
//                   </HStack>
//                 </VStack>
//               </Box>

//               <VoiceStep selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} />

//               <HStack spacing={2} justifyContent="space-between">
//                 <Button
//                   leftIcon={<RepeatIcon />}
//                   onClick={handleRegenerate}
//                   colorScheme="blue"
//                   isLoading={isRegenerating}
//                   loadingText="Regenerating..."
//                 >
//                   Regenerate Voice Script
//                 </Button>
//                 <Tooltip label="Preview voice">
//                   <Button leftIcon={<ViewIcon />} variant="outline">
//                     Preview
//                   </Button>
//                 </Tooltip>
//               </HStack>
//             </VStack>
//           </ModalBody>

//           <ModalFooter>
//             <Button colorScheme="blue" onClick={onClose}>
//               Close
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </Flex>

//   );
// }

// export default RedditStory;

import React, { useState, useEffect, useRef } from 'react';
import {
  Progress, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import {
  Box, Flex, VStack, HStack, Text, Heading, Input, Button, Textarea, Switch,
  useColorMode, IconButton, Card, CardBody, Select, AspectRatio, Tooltip,
  Image, FormControl, FormLabel, Editable, EditableInput, EditablePreview
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiUpload, FiPlay, FiPause, FiVideo, FiMic, FiUser, FiMessageSquare, FiShare2, FiEdit, FiSettings, FiHelpCircle, FiArrowLeft } from 'react-icons/fi';
import { Composition } from 'remotion';
import { useNavigate } from 'react-router-dom';
import { RepeatIcon, ViewIcon } from '@chakra-ui/icons';
import Sidebar from '../components/Sidebar';
import VoiceStep from '../components/Videocreation/steps/VoiceStep';

// Import the video file
import outputVideo from '../../src/output.mp4';

const voiceOptions = ["Male 1", "Male 2", "Female 1", "Female 2", "Neutral"];

const RedditVideo = ({ title, profileName, script, profileImage, backgroundVideo }) => (
  <div style={{ padding: 20, color: '#000', backgroundColor: '#fff', border: '1px solid #ddd' }}>
    <h1>{title || "Reddit Post Title"}</h1>
    <h3>{profileName || "username"}</h3>
    {profileImage && <img src={profileImage} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%' }} />}
    <p>{script || "Your script will appear here..."}</p>
    {backgroundVideo && <video src={backgroundVideo} style={{ width: '100%', height: 'auto' }} controls />}
  </div>
);

function RedditStory() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [title, setTitle] = useState("");
  const [profileName, setProfileName] = useState("");
  const [introVoice, setIntroVoice] = useState(voiceOptions[0]);
  const [storyVoice, setStoryVoice] = useState(voiceOptions[0]);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundVideo, setBackgroundVideo] = useState(outputVideo); // Set default video to imported file
  const [projectTitle, setProjectTitle] = useState("My Reddit Video Project");

  const profileImageInputRef = useRef(null);
  const backgroundVideoInputRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundVideo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [script, setScript] = useState('');
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
    <Flex direction="column" h="120vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      {/* Top Bar */}
      <Flex bg={colorMode === 'light' ? 'white' : 'gray.800'} p={4} alignItems="center" boxShadow="md">
        <IconButton
          icon={<FiArrowLeft />}
          onClick={() => navigate('/dashboard/content-studio')}
          aria-label="Back to Home"
          mr={4}
        />
        <Editable
          value={projectTitle}
          onChange={(value) => setProjectTitle(value)}
          fontSize="xl"
          fontWeight="bold"
          flex={1}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
        <HStack spacing={2}>
          <Tooltip label={colorMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <Switch
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
              size="sm"
              colorScheme="purple"
            />
          </Tooltip>
          <Tooltip label="Settings">
            <IconButton icon={<FiSettings />} variant="ghost" aria-label="Settings" size="sm" />
          </Tooltip>
          <Tooltip label="Help">
            <IconButton icon={<FiHelpCircle />} variant="ghost" aria-label="Help" size="sm" />
          </Tooltip>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Flex flex={1} overflow="hidden">
        {/* Left Column - Inputs */}
        <Box w="50%" p={4} overflowY="auto" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
          <VStack spacing={4} align="stretch">
            {/* Post Details Section */}
            <Card>
              <CardBody>
                <HStack mb={2}>
                  <FiEdit color="blue.500" />
                  <Heading size="sm">Post Details</Heading>
                </HStack>
                <VStack spacing={3}>
                  <Box w="full">
                    <Text fontSize="xs" mb={1}>Title</Text>
                    <Input
                      size="sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter post title"
                      borderColor="blue.200"
                    />
                  </Box>
                  <Box w="full">
                    <Text fontSize="xs" mb={1}>Profile Name</Text>
                    <Input
                      size="sm"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Enter profile name"
                      borderColor="blue.200"
                    />
                  </Box>
                  <FormControl>
                    <FormLabel fontSize="xs">Profile Image</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      ref={profileImageInputRef}
                      display="none"
                    />
                    <Button
                      size="sm"
                      leftIcon={<FiUpload />}
                      onClick={() => profileImageInputRef.current.click()}
                    >
                      Upload Profile Image
                    </Button>
                  </FormControl>
                  {profileImage && (
                    <Image src={profileImage} alt="Profile" boxSize="50px" borderRadius="full" />
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Script Section */}
            <Card>
              <CardBody>
                <HStack mb={2}>
                  <FiEdit color="green.500" />
                  <Heading size="sm">Script</Heading>
                </HStack>
                <Textarea
                  size="sm"
                  value={script}
                  onChange={handleScriptChange}
                  placeholder="Enter your script here"
                  rows={6}
                  borderColor="green.200"
                />
              </CardBody>
            </Card>

            {/* Voice Settings */}
            <Card>
              <CardBody>
                <HStack mb={2}>
                  <FiMic color="purple.500" />
                  <Heading size="sm">Voice Settings</Heading>
                </HStack>
                <VStack spacing={3}>
                  <Box w="full">
                    <Text fontSize="xs" mb={1}>Intro Voice</Text>
                    <Select size="sm" value={introVoice} onChange={(e) => setIntroVoice(e.target.value)} borderColor="purple.200">
                      {voiceOptions.map((voice) => (
                        <option key={voice} value={voice}>{voice}</option>
                      ))}
                    </Select>
                  </Box>
                  <Box w="full">
                    <Text fontSize="xs" mb={1}>Story Voice</Text>
                    <Select size="sm" value={storyVoice} onChange={(e) => setStoryVoice(e.target.value)} borderColor="purple.200">
                      {voiceOptions.map((voice) => (
                        <option key={voice} value={voice}>{voice}</option>
                      ))}
                    </Select>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
                        {/* Background Video Upload */}
           <Card>
               <CardBody>
                 <HStack mb={2}>
                   <FiVideo color="orange.500" />
                   <Heading size="sm">Background Video</Heading>
                 </HStack>
                 <FormControl>
                   <Input
                     type="file"
                     accept="video/*"
                     onChange={handleBackgroundVideoUpload}
                     ref={backgroundVideoInputRef}
                     display="none"
                   />
                   <Button
                     size="sm"
                     leftIcon={<FiUpload />}
                     onClick={() => backgroundVideoInputRef.current.click()}
                   >
                     Upload Background Video
                   </Button>
                 </FormControl>
                 {backgroundVideo && (
                   <Text fontSize="xs" mt={2}>Video uploaded successfully</Text>
                 )}
               </CardBody>
             </Card>
             <Card>
               <CardBody>
                 <FormLabel fontSize="xs">Select Audio</FormLabel>

                 <Button
                   size="sm"
                   leftIcon={<FiUpload />}
                   onClick={onOpen}
                 //onClick={() => audioFileInputRef.current.click()}
                 >
                   Select Audio File
                 </Button>
               </CardBody>
             </Card>
          </VStack>
        </Box>

        {/* Right Column - Preview */}
        <Box w="50%" p={4} overflowY="auto" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
          <VStack spacing={4} align="stretch">
            {/* Reddit Post Preview */}
            <RedditVideo
              title={title}
              profileName={profileName}
              script={script}
              profileImage={profileImage}
              backgroundVideo={backgroundVideo} // Preview the background video (output.mp4)
            />
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}

export default RedditStory;
