import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

function EditPanel({ item }) {
  const bg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box bg={bg} p={4} height="100%" color={textColor}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Edit {item}
      </Text>
      {/* Add specific edit controls based on the selected item */}
    </Box>
  );
}

export default EditPanel;