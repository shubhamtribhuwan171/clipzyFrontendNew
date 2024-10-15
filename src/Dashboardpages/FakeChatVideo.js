import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Flex, VStack, HStack, Text, Heading, Input, Button, Tabs, TabList, TabPanels, Tab, TabPanel,
    Switch, Slider, SliderTrack, SliderFilledTrack, SliderThumb, useColorMode, IconButton,
    Card, CardBody, FormLabel, Select, Textarea, AspectRatio, Tooltip, Editable, EditableInput, EditablePreview
} from '@chakra-ui/react';
import { RepeatIcon, ViewIcon } from '@chakra-ui/icons';

import {
    Progress, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiUpload, FiPlay, FiPause, FiMusic, FiImage, FiMessageCircle, FiPlus, FiTrash2, FiUser, FiUsers, FiClock, FiSettings, FiHelpCircle, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import VoiceStep from '../components/Videocreation/steps/VoiceStep'; // Import VoiceStep
import outputVideo from '../../src/output.mp4';

const chatTypes = ["iMessage", "WhatsApp", "Instagram", "Tinder"];
const voiceOptions = ["Male 1", "Male 2", "Female 1", "Female 2", "Neutral"];

function FakeChatVideo() {
    const navigate = useNavigate();
    const [backgroundVideo, setBackgroundVideo] = useState(outputVideo);
    const backgroundVideoInputRef = useRef(null);
    const buttonStyles = {
        backgroundColor: '#6200ea',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '30px',
        fontWeight: 'bold',
        textTransform: 'none',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

    };

    const hoverStyles = {
        backgroundColor: '#4500c0',
    };

    const iconStyles = {
        marginLeft: '8px',
    };


    const { colorMode, toggleColorMode } = useColorMode();
    const [activeTab, setActiveTab] = useState("global");
    const [userName, setUserName] = useState("");
    const [projectName, setProjectName] = useState("Untitled Project");

    const [chatType, setChatType] = useState(chatTypes[0]);
    const [senderName, setSenderName] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [messageGap, setMessageGap] = useState(1);
    const [senderVoice, setSenderVoice] = useState(voiceOptions[0]);
    const [receiverVoice, setReceiverVoice] = useState(voiceOptions[2]);
    const [messages, setMessages] = useState([
        { type: "text", content: "", isSender: true, voiceEffect: "None" }
    ]);
    const [previewPlaying, setPreviewPlaying] = useState(false);

    const addMessage = (type) => {
        setMessages([...messages, {
            type,
            content: type === "text" ? "" : null,
            isSender: !messages[messages.length - 1].isSender,
            voiceEffect: "None"
        }]);
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
    //
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

    //
    const removeMessage = (index) => {
        setMessages(messages.filter((_, i) => i !== index));
    };

    return (

        <Flex direction="column" h="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
            <HStack spacing={4} p={4} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
                <IconButton icon={<FiArrowLeft />} onClick={() => navigate('/dashboard/content-studio')} aria-label="Back to Home" variant="ghost" />
                <Editable value={projectName} onChange={setProjectName}>
                    <EditablePreview fontWeight="bold" />
                    <EditableInput />
                </Editable>
            </HStack>
            <Flex flex={1}>

                <Box w="50%" p={4} overflowY="auto" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="md">Fake Text Chat Generator</Heading>
                        <HStack spacing={2}>
                            <Tooltip label={colorMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                                <Switch
                                    isChecked={colorMode === 'dark'}
                                    onChange={toggleColorMode}
                                    size="sm"
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

                    <Tabs index={activeTab === "global" ? 0 : 1} onChange={(index) => setActiveTab(index === 0 ? "global" : "messages")} size="sm">
                        <TabList mb={4}>
                            <Tab><FiSettings /> Global Settings</Tab>
                            <Tab><FiMessageCircle /> Messages</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel p={0}>
                                <VStack spacing={4} align="stretch">
                                    <Card>
                                        <CardBody>
                                            <HStack mb={2}>
                                                <FiUsers />
                                                <Text fontSize="sm" fontWeight="medium">Chat Configuration</Text>
                                            </HStack>
                                            <VStack spacing={3}>
                                                <Box w="full">
                                                    <Text fontSize="xs" mb={1}>Your Name</Text>
                                                    <Input
                                                        size="sm"
                                                        value={userName}
                                                        onChange={(e) => setUserName(e.target.value)}
                                                        placeholder="Enter your name"
                                                    />
                                                </Box>
                                                <Box w="full">
                                                    <Text fontSize="xs" mb={1}>Chat Window Type</Text>
                                                    <Select size="sm" value={chatType} onChange={(e) => setChatType(e.target.value)}>
                                                        {chatTypes.map((type) => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </Select>
                                                </Box>
                                            </VStack>
                                        </CardBody>
                                    </Card>

                                    <Flex gap={4}>
                                        {[
                                            { title: 'Sender Profile', name: senderName, setName: setSenderName, voice: senderVoice, setVoice: setSenderVoice, color: 'blue' },
                                            { title: 'Receiver Profile', name: receiverName, setName: setReceiverName, voice: receiverVoice, setVoice: setReceiverVoice, color: 'green' }
                                        ].map((profile, index) => (
                                            <Card key={index} flex={1} borderColor={`${profile.color}.200`} borderWidth={1}>
                                                <CardBody>
                                                    <HStack mb={2}>
                                                        <FiUser color={`${profile.color}.500`} />
                                                        <Text fontSize="sm" fontWeight="medium">{profile.title}</Text>
                                                    </HStack>
                                                    <VStack spacing={3}>
                                                        <Box w="full">
                                                            <Text fontSize="xs" mb={1}>{profile.title.split(' ')[0]} Name</Text>
                                                            <Input
                                                                size="sm"
                                                                value={profile.name}
                                                                onChange={(e) => profile.setName(e.target.value)}
                                                                placeholder={`Enter ${profile.title.toLowerCase()} name`}
                                                            />
                                                        </Box>
                                                        <Box w="full">
                                                            <Text fontSize="xs" mb={1}>{profile.title.split(' ')[0]} Avatar</Text>
                                                            <Button leftIcon={<FiUpload />} w="full" h={24} variant="outline" size="sm" colorScheme={profile.color}>
                                                                Upload avatar
                                                            </Button>
                                                        </Box>
                                                        <Box w="full">
                                                            <Text fontSize="xs" mb={1}>{profile.title.split(' ')[0]} Voice</Text>
                                                            <Select size="sm" value={profile.voice} onChange={(e) => profile.setVoice(e.target.value)}>
                                                                {voiceOptions.map((voice) => (
                                                                    <option key={voice} value={voice}>{voice}</option>
                                                                ))}
                                                            </Select>
                                                        </Box>
                                                    </VStack>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </Flex>

                                    <Card>
                                        <CardBody>
                                            <HStack mb={2}>
                                                <FiClock color="orange.500" />
                                                <Text fontSize="sm" fontWeight="medium">Timing</Text>
                                            </HStack>
                                            <Text fontSize="xs" mb={1}>Gap between messages (seconds)</Text>
                                            <Slider
                                                min={0.5}
                                                max={5}
                                                step={0.5}
                                                value={messageGap}
                                                onChange={(value) => setMessageGap(value)}
                                                colorScheme="orange"
                                            >
                                                <SliderTrack>
                                                    <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb />
                                            </Slider>
                                            <Text fontSize="xs" textAlign="right">{messageGap} seconds</Text>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody>
                                            <HStack mb={2}>
                                                <FiImage color="purple.500" />
                                                <Text fontSize="sm" fontWeight="medium">Background</Text>
                                            </HStack>
                                            <Tabs variant="soft-rounded" size="sm" colorScheme="purple">
                                                <TabList>
                                                    <Tab fontSize="xs">Background Image</Tab>
                                                    <Tab fontSize="xs">Background Video</Tab>
                                                </TabList>
                                                <TabPanels>
                                                    <TabPanel>
                                                        <Button leftIcon={<FiUpload />} w="full" h={24} variant="outline" size="sm" colorScheme="purple">
                                                            Upload background image
                                                        </Button>
                                                    </TabPanel>
                                                    <TabPanel>
                                                        <Button leftIcon={<FiUpload />} w="full" h={24} variant="outline" size="sm" colorScheme="purple">
                                                            Upload background video
                                                        </Button>
                                                    </TabPanel>
                                                </TabPanels>
                                            </Tabs>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody>
                                            <HStack mb={2}>
                                                <FiMusic color="pink.500" />
                                                <Text fontSize="sm" fontWeight="medium">Background Music</Text>
                                            </HStack>
                                            <Button leftIcon={<FiUpload />} w="full" h={24} variant="outline" size="sm" colorScheme="pink">
                                                Upload background music
                                            </Button>
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
                            </TabPanel>
                            <TabPanel p={0}>
                                <Card>
                                    <CardBody>
                                        <HStack mb={2}>
                                            <FiMessageCircle color="teal.500" />
                                            <Text fontSize="sm" fontWeight="medium">Messages</Text>
                                        </HStack>
                                        <VStack spacing={4} align="stretch">
                                            {messages.map((message, index) => (
                                                <Card key={index} p={3} bg="gray.50">
                                                    <Flex justify="space-between" align="center" mb={2}>
                                                        <Text fontSize="sm" fontWeight="medium">Message {index + 1}</Text>
                                                        <IconButton
                                                            icon={<FiTrash2 />}
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeMessage(index)}
                                                        />
                                                    </Flex>
                                                    <VStack spacing={2} align="stretch">
                                                        <HStack>
                                                            <Text fontSize="xs">Sender:</Text>
                                                            <Select
                                                                size="sm"
                                                                value={message.isSender ? "Sender" : "Receiver"}
                                                                onChange={(e) => {
                                                                    const newMessages = [...messages];
                                                                    newMessages[index].isSender = e.target.value === "Sender";
                                                                    setMessages(newMessages);
                                                                }}
                                                            >
                                                                <option value="Sender">Sender</option>
                                                                <option value="Receiver">Receiver</option>
                                                            </Select>
                                                        </HStack>
                                                        <HStack>
                                                            <Text fontSize="xs">Type:</Text>
                                                            <Select
                                                                size="sm"
                                                                value={message.type}
                                                                onChange={(e) => {
                                                                    const newMessages = [...messages];
                                                                    newMessages[index].type = e.target.value;
                                                                    newMessages[index].content = e.target.value === "text" ? "" : null;
                                                                    setMessages(newMessages);
                                                                }}
                                                            >
                                                                <option value="text">Text</option>
                                                                <option value="image">Image</option>
                                                            </Select>
                                                        </HStack>
                                                        {message.type === "text" ? (
                                                            <Textarea
                                                                size="sm"
                                                                value={message.content}
                                                                onChange={(e) => {
                                                                    const newMessages = [...messages];
                                                                    newMessages[index].content = e.target.value;
                                                                    setMessages(newMessages);
                                                                }}
                                                                placeholder="Enter message text"
                                                            />
                                                        ) : (
                                                            <Button leftIcon={<FiUpload />} w="full" h={24} variant="outline" size="sm">
                                                                Upload image
                                                            </Button>
                                                        )}
                                                        <HStack>
                                                            <Text fontSize="xs">Voice Effect:</Text>
                                                            <Select
                                                                size="sm"
                                                                value={message.voiceEffect}
                                                                onChange={(e) => {
                                                                    const newMessages = [...messages];
                                                                    newMessages[index].voiceEffect = e.target.value;
                                                                    setMessages(newMessages);
                                                                }}
                                                            >
                                                                <option value="None">None</option>
                                                                <option value="Echo">Echo</option>
                                                                <option value="Reverb">Reverb</option>
                                                                <option value="Pitch Shift">Pitch Shift</option>
                                                            </Select>
                                                        </HStack>
                                                    </VStack>
                                                </Card>
                                            ))}
                                            <HStack>
                                                <Button leftIcon={<FiPlus />} onClick={() => addMessage("text")} flex={1} size="sm" colorScheme="teal">
                                                    Add Text Message
                                                </Button>
                                                <Button leftIcon={<FiPlus />} onClick={() => addMessage("image")} flex={1} size="sm" colorScheme="teal">
                                                    Add Image Message
                                                </Button>
                                            </HStack>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>

                {/* Right Column - Preview */}
                <Flex w="50%" bg="gray.900" p={4} direction="column">
                    <Flex flex={1} align="center" justify="center">
                        <AspectRatio ratio={9 / 16} w="full" maxW="sm">
                            <Box bg={colorMode === 'light' ? 'white' : 'gray.800'} borderRadius="lg" overflow="hidden">
                                <VStack h="full" spacing={0}>
                                    <Box bg="blue.500" color="white" p={2} w="full">
                                        <Heading size="sm">{chatType} Chat</Heading>
                                        <Text fontSize="xs">{senderName || "Sender"} and {receiverName || "Receiver"}</Text>
                                    </Box>
                                    <VStack flex={1} w="full" bg="gray.100" p={3} overflowY="auto" spacing={3}>
                                        {messages.map((message, index) => (
                                            <Flex key={index} w="full" justify={message.isSender ? 'flex-end' : 'flex-start'}>
                                                <Box
                                                    maxW="70%"
                                                    p={2}
                                                    borderRadius="lg"
                                                    bg={message.isSender ? 'blue.500' : 'gray.300'}
                                                    color={message.isSender ? 'white' : 'black'}
                                                >
                                                    {message.type === "text" ? (
                                                        <Text fontSize="xs">{message.content || `Message ${index + 1}`}</Text>
                                                    ) : (
                                                        <Box w={24} h={24} bg="gray.400" display="flex" alignItems="center" justifyContent="center">
                                                            <FiImage size={24} color="gray.600" />
                                                        </Box>
                                                    )}
                                                </Box>

                                            </Flex>
                                        ))}
                                    </VStack>
                                </VStack>
                            </Box>
                        </AspectRatio>
                    </Flex>
                    <Button
                        style={buttonStyles}
                        onMouseOver={(e) => (e.target.style.backgroundColor = hoverStyles.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyles.backgroundColor)}
                    //onClick={onClick}
                    //disabled={isLoading}
                    >
                        <>
                            Generate Video

                        </>
                    </Button>

                    <HStack justify="center" mt={4}>
                        <IconButton
                            icon={previewPlaying ? <FiPause /> : <FiPlay />}
                            onClick={() => setPreviewPlaying(!previewPlaying)}
                            aria-label={previewPlaying ? "Pause" : "Play"}
                            size="sm"
                        />
                    </HStack>
                </Flex>
            </Flex>
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
        </Flex>
    );
}

export default FakeChatVideo;

// import { Composition } from 'remotion';
// import React, { useState } from 'react';
// import {
//     Box, Flex, VStack, HStack, Text, Heading, Input, Button, Tabs, TabList, TabPanels, Tab, TabPanel,
//     Switch, Slider, SliderTrack, SliderFilledTrack, SliderThumb, useColorMode, IconButton,
//     Card, CardBody, Select, Textarea, AspectRatio, Tooltip
// } from '@chakra-ui/react';
// import { FiSun, FiMoon, FiUpload, FiPlay, FiPause, FiMusic, FiImage, FiMessageCircle, FiPlus, FiTrash2, FiUser, FiUsers, FiClock, FiSettings, FiHelpCircle } from 'react-icons/fi';

// const chatTypes = ["iMessage", "WhatsApp", "Instagram", "Tinder"];
// const voiceOptions = ["Male 1", "Male 2", "Female 1", "Female 2", "Neutral"];

// const FakeChatVideo = () => {
//     const { colorMode, toggleColorMode } = useColorMode();
//     const [activeTab, setActiveTab] = useState("global");
//     const [userName, setUserName] = useState("");
//     const [chatType, setChatType] = useState(chatTypes[0]);
//     const [senderName, setSenderName] = useState("");
//     const [receiverName, setReceiverName] = useState("");
//     const [messageGap, setMessageGap] = useState(1);
//     const [senderVoice, setSenderVoice] = useState(voiceOptions[0]);
//     const [receiverVoice, setReceiverVoice] = useState(voiceOptions[2]);
//     const [messages, setMessages] = useState([
//         { type: "text", content: "", isSender: true, voiceEffect: "None" }
//     ]);
//     const [previewPlaying, setPreviewPlaying] = useState(false);

//     const addMessage = (type) => {
//         setMessages([...messages, {
//             type,
//             content: type === "text" ? "" : null,
//             isSender: !messages[messages.length - 1].isSender,
//             voiceEffect: "None"
//         }]);
//     };

//     const removeMessage = (index) => {
//         setMessages(messages.filter((_, i) => i !== index));
//     };

//     return (
//         <Flex h="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
//             {/* Left Column - Inputs */}
//             <Box w="50%" p={4} overflowY="auto" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
//                 <Flex justify="space-between" align="center" mb={4}>
//                     <Heading size="md">Fake Text Chat Generator</Heading>
//                     <HStack spacing={2}>
//                         <Tooltip label={colorMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
//                             <Switch
//                                 isChecked={colorMode === 'dark'}
//                                 onChange={toggleColorMode}
//                                 size="sm"
//                             />
//                         </Tooltip>
//                         <Tooltip label="Settings">
//                             <IconButton icon={<FiSettings />} variant="ghost" aria-label="Settings" size="sm" />
//                         </Tooltip>
//                         <Tooltip label="Help">
//                             <IconButton icon={<FiHelpCircle />} variant="ghost" aria-label="Help" size="sm" />
//                         </Tooltip>
//                     </HStack>
//                 </Flex>

//                 {/* Global and Messages Settings */}
//                 {/* Your current Tabs and Components */}
//             </Box>

//             {/* Right Column - Preview */}
//             <Flex w="50%" bg="gray.900" p={4} direction="column">
//                 <Flex flex={1} align="center" justify="center">
//                     <AspectRatio ratio={9 / 16} w="full" maxW="sm">
//                         <Box bg={colorMode === 'light' ? 'white' : 'gray.800'} borderRadius="lg" overflow="hidden">
//                             <VStack h="full" spacing={0}>
//                                 <Box bg="blue.500" color="white" p={2} w="full">
//                                     <Heading size="sm">{chatType} Chat</Heading>
//                                     <Text fontSize="xs">{senderName || "Sender"} and {receiverName || "Receiver"}</Text>
//                                 </Box>
//                                 <VStack flex={1} w="full" bg="gray.100" p={3} overflowY="auto" spacing={3}>
//                                     {messages.map((message, index) => (
//                                         <Flex key={index} w="full" justify={message.isSender ? 'flex-end' : 'flex-start'}>
//                                             <Box
//                                                 maxW="70%"
//                                                 p={2}
//                                                 borderRadius="lg"
//                                                 bg={message.isSender ? 'blue.500' : 'gray.300'}
//                                                 color={message.isSender ? 'white' : 'black'}
//                                             >
//                                                 {message.type === "text" ? (
//                                                     <Text fontSize="xs">{message.content || `Message ${index + 1}`}</Text>
//                                                 ) : (
//                                                     <Box w={24} h={24} bg="gray.400" display="flex" alignItems="center" justifyContent="center">
//                                                         <FiImage size={24} color="gray.600" />
//                                                     </Box>
//                                                 )}
//                                             </Box>

//                                         </Flex>
//                                     ))}
//                                 </VStack>
//                             </VStack>
//                         </Box>
//                     </AspectRatio>
//                 </Flex>
//                 <HStack justify="center" mt={4}>
//                     <IconButton
//                         icon={previewPlaying ? <FiPause /> : <FiPlay />}
//                         onClick={() => setPreviewPlaying(!previewPlaying)}
//                         aria-label={previewPlaying ? "Pause" : "Play"}
//                         size="sm"
//                     />
//                 </HStack>
//             </Flex>
//         </Flex>
//     );
// };

// // Remotion Composition
// export const RemotionFakeChatVideo = () => {
//     return (
//         <Composition
//             id="FakeChatVideo"
//             component={FakeChatVideo}
//             durationInFrames={150} // 5 seconds at 30 fps
//             fps={30}
//             width={1080}
//             height={1920}
//         />
//     );
// };

// export default FakeChatVideo;
