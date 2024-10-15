import React, { useState, useEffect } from 'react';
import { VStack, Heading, Box, Image, Text, Input, FormControl, FormLabel, useColorModeValue, IconButton, AspectRatio, } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { keyframes } from '@emotion/react';  // Import keyframes from @emotion/react

// Define the keyframe for fading in and out
const fadeInOut = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

// TopicCard component that shows the images with smooth transitions
const TopicCard = ({ topic, isSelected, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cycle through images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % Math.min(topic.thumbnails.length, 5));
    }, 2000); // Change the image every 2 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [topic.thumbnails.length]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selectedBorderColor = 'purple.500';

  return (
    <Box
      borderWidth="2px"
      borderColor={isSelected ? selectedBorderColor : borderColor}
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      bg={bgColor}
      boxShadow={isSelected ? 'lg' : 'md'}
      transition="all 0.3s"
      _hover={{ transform: 'scale(1.05)' }}
    >
      <AspectRatio ratio={9 / 16} width="100%">
        <Image
          src={topic.thumbnails[currentImageIndex]}
          alt={topic.name}
          objectFit="cover"
          animation={`${fadeInOut} 2s ease-in-out infinite`} // Add smooth fade-in-out animation
        />
      </AspectRatio>
      <Box p={2}>
        <Text fontWeight="bold" textAlign="center">{topic.name}</Text>
      </Box>
    </Box>
  );
};

// The main component
const TopicStep = ({ formData, setFormData, setIsInteractingWithCarousel }) => {
  const [sliderRef, setSliderRef] = useState(null);

  const handleTopicSelect = (topic) => {
    setFormData(prev => ({ ...prev, topic: topic.name }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      }
    ],
    swipe: true,
    swipeToSlide: true,
    beforeChange: () => setIsInteractingWithCarousel(true),
    afterChange: () => setIsInteractingWithCarousel(false),
    arrows: false,
  };

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg" textAlign="center">Choose Your Topic</Heading>
      <Box 
        position="relative" 
        onMouseEnter={() => setIsInteractingWithCarousel(true)}
        onMouseLeave={() => setIsInteractingWithCarousel(false)}
        onTouchStart={() => setIsInteractingWithCarousel(true)}
        onTouchEnd={() => setIsInteractingWithCarousel(false)}
      >
        <Slider ref={setSliderRef} {...settings}>
          {customBackgroundVideos.map((topic) => (
            <Box key={topic.name} px={2}>
              <TopicCard
                topic={topic}
                isSelected={formData.topic === topic.name}
                onClick={() => handleTopicSelect(topic)}
              />
            </Box>
          ))}
        </Slider>
        <IconButton
          aria-label="Previous topic"
          icon={<ChevronLeftIcon />}
          position="absolute"
          left="-12px"
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          onClick={() => sliderRef?.slickPrev()}
        />
        <IconButton
          aria-label="Next topic"
          icon={<ChevronRightIcon />}
          position="absolute"
          right="-12px"
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          onClick={() => sliderRef?.slickNext()}
        />
      </Box>
      <FormControl>
        <FormLabel>Keywords (comma-separated)</FormLabel>
        <Input
          name="keywords"
          placeholder="Enter keywords, separated by commas"
          value={formData.keywords}
          onChange={handleInputChange}
        />
      </FormControl>
    </VStack>
  );
};

// Array with multiple images (up to 5) for each topic
const customBackgroundVideos = [
  { name: "Bedtime Stories", thumbnails: ["/styles/BedtimeStories1.png", "/styles/BedtimeStories2.png", "/styles/BedtimeStories3.png", "/styles/BedtimeStories4.png", "/styles/BedtimeStories5.png"] },
  { name: "Fantasy", thumbnails: ["/styles/Fantasy1.png", "/styles/Fantasy2.png", "/styles/Fantasy3.png", "/styles/Fantasy4.png", "/styles/Fantasy5.png"] },
  { name: "History", thumbnails: ["/styles/History1.png", "/styles/History2.png", "/styles/History3.png", "/styles/History4.png", "/styles/History5.png"] },
  { name: "Motivational", thumbnails: ["/styles/Motivational1.png", "/styles/Motivational2.png", "/styles/Motivational3.png", "/styles/Motivational4.png", "/styles/Motivational5.png"] },
  { name: "Philosophy", thumbnails: [ "/styles/Philosophy2.png", "/styles/Philosophy3.png", "/styles/Philosophy4.png", "/styles/Philosophy5.png"] },
  { name: "Relationship Drama", thumbnails: ["/styles/RelationshipDrama1.png", "/styles/RelationshipDrama2.png", "/styles/RelationshipDrama3.png", "/styles/RelationshipDrama4.png", "/styles/RelationshipDrama5.png"] },
  { name: "Scary", thumbnails: ["/styles/Scary1.png", "/styles/Scary2.png", "/styles/Scary3.png", "/styles/Scary4.png", "/styles/Scary5.png"] },
  { name: "Science Fiction", thumbnails: ["/styles/ScienceFiction1.png", "/styles/ScienceFiction2.png", "/styles/ScienceFiction3.png", "/styles/ScienceFiction4.png", "/styles/ScienceFiction5.png"] },
  { name: "Travel", thumbnails: ["/styles/Travel1.png", "/styles/Travel2.png", "/styles/Travel3.png", "/styles/Travel4.png", "/styles/Travel5.png"] }
];

export default TopicStep;
