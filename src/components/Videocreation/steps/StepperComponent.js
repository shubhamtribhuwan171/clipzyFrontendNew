import React from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';

const StepperComponent = ({ steps, activeStep }) => {
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const inactiveColor = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Flex justify="space-between" mb={8}>
      {steps.map((step, index) => (
        <Flex key={step.title} align="center" direction="column">
          <Box
            w={8}
            h={8}
            borderRadius="50%"
            bg={index <= activeStep ? activeColor : inactiveColor}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
          >
            {index + 1}
          </Box>
          <Text
            mt={2}
            fontSize="sm"
            color={index <= activeStep ? textColor : inactiveColor}
            fontWeight={index <= activeStep ? 'bold' : 'normal'}
          >
            {step.title}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default StepperComponent;