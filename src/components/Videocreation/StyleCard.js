import React, { useState, useRef } from 'react';
import { Box, Text, Button, Tag, HStack, VStack, useColorModeValue, Tooltip,AspectRatio,Image} from '@chakra-ui/react';
import { FaPlay, FaPause, FaInfoCircle } from 'react-icons/fa';

const StyleCard = ({ style, isSelected, onClick }) => {
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');

    return (
        <Box
            borderWidth="2px"
            borderRadius="lg"
            borderColor={isSelected ? selectedBorderColor : borderColor}
            overflow="hidden"
            cursor="pointer"
            onClick={onClick}
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
        >
            <AspectRatio ratio={9 / 16} maxW="200px" margin="auto">
                <Image
                    src={`/images/${style.toLowerCase().replace(/\s/g, '-')}.jpg`}
                    alt={`${style} preview`}
                    objectFit="cover"
                />
            </AspectRatio>
            <Box p="2">
                <Text fontWeight="bold" textAlign="center">{style}</Text>
            </Box>
        </Box>
    );
};


export default StyleCard;

