import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, IconButton, HStack,useColorMode, Button, Card, CardBody, Flex, Grid, Heading, Image, Input, Radio, RadioGroup, Stack, Text, Textarea, Tooltip, VStack, useColorModeValue
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from "@chakra-ui/icons";
import { FaPlay, FaPause, FaVideo, FaImage, FaMagic, FaMicrophone } from "react-icons/fa";
import { FiSun, FiMoon, FiSettings, FiHelpCircle, FiChevronLeft, FiChevronRight, FiUpload, FiPlusCircle, FiMinusCircle, FiPlay, FiPause, FiSkipBack, FiSkipForward, FiTrash2, FiCopy, FiEdit, FiImage, FiList, FiCheck, FiArrowLeft } from 'react-icons/fi';
import VoiceCard from "../components/Videocreation/VoiceCard";
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: "Education", icon: "👨‍🏫", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop" },
  { name: "Entertainment", icon: "🎭", image: "https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?w=300&h=200&fit=crop" },
  { name: "Business", icon: "💼", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=200&fit=crop" },
  { name: "Technology", icon: "💻", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop" },
  { name: "Lifestyle", icon: "🌿", image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=300&h=200&fit=crop" },
];

const imageStyles = [
  { name: "Realistic", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&h=200&fit=crop" },
  { name: "Cartoon", image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?w=300&h=200&fit=crop" },
  { name: "Abstract", image: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=300&h=200&fit=crop" },
  { name: "Minimalist", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&h=200&fit=crop" },
];

const customBackgroundVideos = [
  { name: "Nature", url: "https://example.com/nature-video.mp4", thumbnail: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=200&fit=crop" },
  { name: "City", url: "https://example.com/city-video.mp4", thumbnail: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&h=200&fit=crop" },
  { name: "Abstract", url: "https://example.com/abstract-video.mp4", thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=200&fit=crop" },
  { name: "Technology", url: "https://example.com/technology-video.mp4", thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop" },
];

const voices = [
  { name: "Alex", accent: "American", age: "30s", gender: "Male", use_case: "Narration", audio: "/path-to-audio-sample-1.mp3" },
  { name: "Emma", accent: "British", age: "20s", gender: "Female", use_case: "Explainer", audio: "/path-to-audio-sample-2.mp3" },
  { name: "Liam", accent: "Australian", age: "40s", gender: "Male", use_case: "Documentary", audio: "/path-to-audio-sample-3.mp3" },
  { name: "Zoe", accent: "French", age: "30s", gender: "Female", use_case: "Storytelling", audio: "/path-to-audio-sample-4.mp3" },
  { name: "Sam", accent: "Neutral", age: "20s", gender: "Non-binary", use_case: "Technical", audio: "/path-to-audio-sample-5.mp3" },
];

const captionStyles = [
  { name: "Subtitles", style: "text-lg", icon: <EditIcon /> },
  { name: "Closed Captions", style: "text-sm bg-black text-white p-1", icon: <EditIcon /> },
  { name: "None", style: "hidden", icon: <EditIcon color="gray.400" /> },
];

export default function AIVideoCreator() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [videoOption, setVideoOption] = useState("");
  const [customVideo, setCustomVideo] = useState("");
  const [imageStyle, setImageStyle] = useState("");
  const [voice, setVoice] = useState("");
  const [captionStyle, setCaptionStyle] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ category, topic, videoOption, customVideo, imageStyle, voice, captionStyle });
    alert("🎉 Awesome! Your AI video creation process has been initiated. Get ready for some magic! ✨");
  };

  const playAudio = (audioSrc) => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
    }
  };

  const toggleVideo = (videoSrc) => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.src = videoSrc;
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const steps = [
    { title: "Choose Your Canvas", icon: <FaVideo />, description: "Select a category and describe your video idea" },
    { title: "Set the Scene", icon: <FaImage />, description: "Pick between AI-generated visuals or custom backgrounds" },
    { title: "Style Your World", icon: <FaMagic />, description: "Choose the perfect look for your AI-generated visuals" },
    { title: "Find Your Voice", icon: <FaMicrophone />, description: "Select the ideal narrator for your video" },
    { title: "Caption Your Story", icon: <EditIcon />, description: "Choose how you want your words to appear" },
  ];

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");

  return (
    <Box>
      <HStack spacing={4} p={4} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
                <IconButton icon={<FiArrowLeft />} onClick={() => navigate('/dashboard/content-studio')} aria-label="Back to Home" variant="ghost" />
                
            </HStack>
   
    <Box maxWidth="4xl" mx="auto" p={6} bg={bgColor}>
      <Heading as="h1" size="2xl" textAlign="center" mb={8}>🎬 AI Video Creator</Heading>
      <Flex justify="space-between" align="center" mb={8}>
        {steps.map((s, index) => (
          <Tooltip key={index} label={`${s.title}: ${s.description}`}>
            <VStack spacing={1} color={step === index + 1 ? "blue.500" : "gray.400"}>
              {s.icon}
              <Text fontSize="xs">{`Step ${index + 1}`}</Text>
            </VStack>
          </Tooltip>
        ))}
      </Flex>
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <VStack spacing={4} align="stretch">
                <Heading size="lg">{steps[0].title}</Heading>
                <Text color="gray.600">{steps[0].description}</Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  {categories.map((cat) => (
                    <Card
                      key={cat.name}
                      cursor="pointer"
                      onClick={() => setCategory(cat.name)}
                      borderColor={category === cat.name ? "blue.500" : "transparent"}
                      borderWidth={2}
                    >
                      <CardBody>
                        <Image src={cat.image} alt={cat.name} borderRadius="md" mb={2} />
                        <Text fontWeight="semibold" textAlign="center">{cat.icon} {cat.name}</Text>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
                <Textarea
                  placeholder="Describe your video idea here... 🎥✨"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </VStack>
            )}

            {step === 2 && (
              <VStack spacing={4} align="stretch">
                <Heading size="lg">{steps[1].title}</Heading>
                <Text color="gray.600">{steps[1].description}</Text>
                <RadioGroup onChange={setVideoOption} value={videoOption}>
                  <Stack direction="column">
                    <Radio value="ai">AI-Generated Visuals 🤖✨</Radio>
                    <Radio value="custom">Custom Background Video 🎬</Radio>
                  </Stack>
                </RadioGroup>
                {videoOption === "custom" && (
                  <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                    {customBackgroundVideos.map((video) => (
                      <Card
                        key={video.name}
                        cursor="pointer"
                        onClick={() => setCustomVideo(video.url)}
                        borderColor={customVideo === video.url ? "blue.500" : "transparent"}
                        borderWidth={2}
                      >
                        <CardBody position="relative">
                          <Image src={video.thumbnail} alt={video.name} borderRadius="md" mb={2} />
                          <Button
                            size="sm"
                            variant="ghost"
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideo(video.url);
                            }}
                          >
                            {videoRef.current?.paused ? <FaPlay /> : <FaPause />}
                          </Button>
                          <Text textAlign="center">{video.name}</Text>
                        </CardBody>
                      </Card>
                    ))}
                  </Grid>
                )}
                <Box aspectRatio={16/9} bg="gray.200" borderRadius="lg" overflow="hidden">
                  {videoOption === "custom" && customVideo && (
                    <video ref={videoRef} src={customVideo} width="100%" height="100%" />
                  )}
                  {videoOption === "ai" && (
                    <Flex align="center" justify="center" height="100%" color="gray.500">
                      <FaMagic />
                      <Text ml={2}>AI-generated video preview (coming soon!)</Text>
                    </Flex>
                  )}
                </Box>
              </VStack>
            )}

            {step === 3 && videoOption === "ai" && (
              <VStack spacing={4} align="stretch">
                <Heading size="lg">{steps[2].title}</Heading>
                <Text color="gray.600">{steps[2].description}</Text>
                <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                  {imageStyles.map((style) => (
                    <Card
                      key={style.name}
                      cursor="pointer"
                      onClick={() => setImageStyle(style.name)}
                      borderColor={imageStyle === style.name ? "blue.500" : "transparent"}
                      borderWidth={2}
                    >
                      <CardBody>
                        <Image src={style.image} alt={style.name} borderRadius="md" mb={2} />
                        <Text fontWeight="semibold" textAlign="center">{style.name}</Text>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </VStack>
            )}

            {step === 4 && (
              <VStack spacing={4} align="stretch">
                <Heading size="lg">{steps[3].title}</Heading>
                <Text color="gray.600">{steps[3].description}</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {voices.map((v) => (
                    // <Card
                    //   key={v.name}
                    //   cursor="pointer"
                    //   onClick={() => setVoice(v.name)}
                    //   borderColor={voice === v.name ? "blue.500" : "transparent"}
                    //   borderWidth={2}
                    // >
                    //   <CardBody>
                    //     <Flex justify="space-between" align="center" mb={2}>
                    //       <Heading size="md">{v.name}</Heading>
                    //       <Button
                    //         size="sm"
                    //         variant="ghost"
                    //         onClick={(e) => {
                    //           e.stopPropagation();
                    //           playAudio(v.audio);
                    //         }}
                    //       >
                    //         <FaPlay />
                    //       </Button>
                    //     </Flex>
                    //     <Text fontSize="sm" color="gray.600">
                    //       {v.accent} accent • {v.age} • {v.gender}
                    //     </Text>
                    //     <Text fontSize="sm" color="gray.600">Best for: {v.use_case}</Text>
                    //   </CardBody>
                    // </Card>
                    <VoiceCard
                        key={v.voice_id}
                        voice={v}
                        onSelect={() => setVoice(v.voice_id)}
                        isSelected={voice === v.voice_id}
                      />
                  ))}
                </Grid>
                <audio ref={audioRef} hidden />
              </VStack>
            )}

            {step === 5 && (
              <VStack spacing={4} align="stretch">
                <Heading size="lg">{steps[4].title}</Heading>
                <Text color="gray.600">{steps[4].description}</Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  {captionStyles.map((style) => (
                    <Card
                      key={style.name}
                      cursor="pointer"
                      onClick={() => setCaptionStyle(style.name)}
                      borderColor={captionStyle === style.name ? "blue.500" : "transparent"}
                      borderWidth={2}
                    >
                      <CardBody textAlign="center">
                        {style.icon}
                        <Text fontWeight="semibold" mt={2}>{style.name}</Text>
                        <Text mt={2} className={style.style}>
                          {style.name !== "None" ? "Example caption text" : "No captions"}
                        </Text>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </VStack>
            )}
          </motion.div>
        </AnimatePresence>

        <Flex justify="space-between" mt={8}>
          {step > 1 && (
            <Button onClick={handleBack} leftIcon={<ChevronLeftIcon />} variant="outline">
              Back
            </Button>
          )}
          {step < 5 ? (
            <Button onClick={handleNext} rightIcon={<ChevronRightIcon />} ml="auto">
              Next
            </Button>
          ) : (
            <Button type="submit" rightIcon={<FaMagic />} ml="auto">
              Create Magic!
            </Button>
          )}
        </Flex>
      </form>
    </Box>
    </Box>
  );
}