import React from 'react';
import { Box, Image, Text, useColorModeValue } from '@chakra-ui/react';

const StyleCard = ({ style, image, isSelected, onClick }) => {
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
            <Image 
                src={image} 
                alt={style} 
                width="100%" 
                height="120px" 
                objectFit="cover"
            />
            <Box p={2}>
                <Text fontWeight="bold" textAlign="center">{style}</Text>
            </Box>
        </Box>
    );
};

export default StyleCard;