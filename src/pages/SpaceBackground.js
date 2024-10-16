import React from 'react';
import { Box } from '@chakra-ui/react';

export const SpaceBackground = () => (
  <Box
    position="fixed"
    top="0"
    left="0"
    right="0"
    bottom="0"
    bg="black"
    zIndex="-1"
  />
);