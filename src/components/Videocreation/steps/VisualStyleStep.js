import React, { useState } from 'react';
import { VStack, Heading, Text, Box, IconButton, useColorModeValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StyleCard from '../StyleCard';

const VisualStyleStep = ({ formData, setFormData, setIsInteractingWithCarousel }) => {
    const [sliderRef, setSliderRef] = useState(null);
    const styles = [
        { name: 'Colorful Comics', image: 'url_to_colorful_comics_image' },
        { name: 'Clipart', image: 'url_to_clipart_image' },
        { name: 'Cinematic', image: 'url_to_cinematic_image' },
        { name: 'Pixel Art', image: 'url_to_pixel_art_image' },
        { name: 'Anime', image: 'url_to_anime_image' },
        { name: 'CyberPunk', image: 'url_to_cyberpunk_image' }
    ];

    const handleStyleChange = (style) => {
        setFormData(prev => ({ ...prev, imageStyle: style }));
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                }
            }
        ],
        swipe: true,
        swipeToSlide: true,
        beforeChange: () => setIsInteractingWithCarousel(true),
        afterChange: () => setIsInteractingWithCarousel(false),
    };

    return (
        <VStack spacing={6} align="stretch">
            <Heading size="lg">Visual Style</Heading>
            <Text>Choose a visual style for your video</Text>
            <Box 
                position="relative" 
                onMouseEnter={() => setIsInteractingWithCarousel(true)}
                onMouseLeave={() => setIsInteractingWithCarousel(false)}
                onTouchStart={() => setIsInteractingWithCarousel(true)}
                onTouchEnd={() => setIsInteractingWithCarousel(false)}
            >
                <Slider ref={setSliderRef} {...settings}>
                    {styles.map((style) => (
                        <Box key={style.name} px={2}>
                            <StyleCard
                                style={style.name}
                                image={style.image}
                                isSelected={formData.imageStyle === style.name}
                                onClick={() => handleStyleChange(style.name)}
                            />
                        </Box>
                    ))}
                </Slider>
                <IconButton
                    aria-label="Previous style"
                    icon={<ChevronLeftIcon />}
                    position="absolute"
                    left="-12px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                    onClick={() => sliderRef?.slickPrev()}
                />
                <IconButton
                    aria-label="Next style"
                    icon={<ChevronRightIcon />}
                    position="absolute"
                    right="-12px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                    onClick={() => sliderRef?.slickNext()}
                />
            </Box>
        </VStack>
    );
};

export default VisualStyleStep;
